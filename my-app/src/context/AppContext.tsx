"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useSocketContext } from "@/providers/SocketProvider";
import {
  listJobs,
  createJob,
  type ApiJob,
  type CreateJobPayload,
} from "@/actions/jobs";
import {
  listApplications,
  createApplication,
  updateApplicationStatus as apiUpdateStatus,
  batchUpdateApplicationStatus as apiBatchUpdate,
  type ApiApplication,
} from "@/actions/applications";
import { listNotifications, markNotificationsRead } from "@/actions/notifications";
import type { ApplicationStatus } from "@/types";
import type {
  SocketApplicationUpdatedPayload,
  SocketBatchUpdatedPayload,
  SocketNotificationPayload,
} from "@/types";

// ─── Status display labels ────────────────────────────────────────────────────
// Prisma enum is the single source of truth; these labels are rendering-only.
export const STATUS_DISPLAY: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  VIEWED: "Viewed",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

// ─── Re-exported types ────────────────────────────────────────────────────────

// Keep the Job shape as a plain object that pages can use
export type { ApiJob as Job };

// Keep the Application shape flat for pages
export interface Application extends ApiApplication {
  // Extra display fields derived client-side
  candidateName: string;
  candidateEmail: string;
  candidateInitials: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  isNew?: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

// ─── Role (for backwards compat with pages that still use it) ────────────────
export type Role = "candidate" | "employer" | "guest";

// ─── CandidateProfile ─────────────────────────────────────────────────────────
export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  status: string;
  bio: string;
  avatar: string;
  resumeName: string;
  resumeUpdated: string;
  skills: string[];
  preferences: {
    roles: string[];
    locations: string[];
    jobTypes: string;
    experience: string;
  };
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface AppContextProps {
  role: Role;
  setRole: (role: Role) => void;
  candidatePage: string;
  setCandidatePage: (page: string) => void;
  employerPage: string;
  setEmployerPage: (page: string) => void;
  profile: CandidateProfile;
  updateProfile: (updated: Partial<CandidateProfile>) => void;
  jobs: ApiJob[];
  jobsLoading: boolean;
  applyToJob: (jobId: string) => Promise<void>;
  postJob: (job: CreateJobPayload) => Promise<void>;
  applications: Application[];
  applicationsLoading: boolean;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  notifications: AppNotification[];
  notificationsLoading: boolean;
  markNotificationsAsRead: () => void;
  selectedAppIds: string[];
  setSelectedAppIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleAppSelection: (appId: string) => void;
  selectAllApps: (appIds: string[]) => void;
  deselectAllApps: () => void;
  batchUpdateStatus: (status: ApplicationStatus) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toApplication(a: ApiApplication, isNew = false): Application {
  return {
    ...a,
    candidateName: a.candidate?.name ?? "Unknown",
    candidateEmail: a.candidate?.email ?? "",
    candidateInitials: (a.candidate?.name ?? "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    jobTitle: a.job?.title ?? "Unknown Job",
    company: a.job?.company ?? "Unknown Company",
    appliedDate: a.createdAt
      ? new Date(a.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Recently",
    isNew,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status: sessionStatus } = useSession();
  const isAuthenticated = sessionStatus === "authenticated";
  const userRole = session?.user?.role;

  const { onApplicationUpdated, onApplicationBatchUpdated, onNotificationNew } =
    useSocketContext();

  // ── UI navigation state ───────────────────────────────────────────────────
  const [role, setRoleState] = useState<Role>("guest");
  const [candidatePage, setCandidatePage] = useState("dashboard");
  const [employerPage, setEmployerPage] = useState("dashboard");

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    if (newRole === "candidate") setCandidatePage("dashboard");
    else if (newRole === "employer") setEmployerPage("dashboard");
  }, []);

  // Sync role with session; useEffect is fine here — role is UI state, not
  // render-critical data, so one-render lag is acceptable.
  useEffect(() => {
    if (!isAuthenticated || !userRole) {
      setRoleState("guest"); // eslint-disable-line react-hooks/set-state-in-effect
    } else if (userRole === "CANDIDATE") {
      setRoleState("candidate");
    } else if (userRole === "EMPLOYER") {
      setRoleState("employer");
    }
  }, [isAuthenticated, userRole]);

  // ── Profile (local state — backed by session name/email) ─────────────────
  const [profile, setProfile] = useState<CandidateProfile>({
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    phone: "",
    location: "",
    dob: "",
    status: "Actively looking for opportunities",
    bio: "",
    avatar: (session?.user?.name ?? "U").charAt(0).toUpperCase(),
    resumeName: "",
    resumeUpdated: "",
    skills: [],
    preferences: {
      roles: [],
      locations: [],
      jobTypes: "Full-time",
      experience: "1 - 3 Years",
    },
  });

  // Sync profile name/email when session resolves — keep it inside an effect
  // to comply with react-hooks/refs (no ref reads during render).
  const sessionName = session?.user?.name;
  const sessionEmail = session?.user?.email;
  useEffect(() => {
    if (sessionName || sessionEmail) {
      setProfile((prev) => ({ // eslint-disable-line react-hooks/set-state-in-effect
        ...prev,
        name: sessionName ?? prev.name,
        email: sessionEmail ?? prev.email,
        avatar: (sessionName ?? prev.avatar).charAt(0).toUpperCase(),
      }));
    }
  }, [sessionName, sessionEmail]);

  const updateProfile = useCallback((updated: Partial<CandidateProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    toast.success("Profile updated successfully!");
  }, []);

  // ── Jobs ─────────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    const result = await listJobs({ limit: 50 });
    if (result.success) {
      setJobs(result.data ?? []);
    }
    setJobsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [fetchJobs]);

  const postJob = useCallback(
    async (jobData: CreateJobPayload) => {
      const result = await createJob(jobData);
      if (result.success) {
        setJobs((prev) => [result.data, ...prev]);
        toast.success("New job posted successfully!");
      } else {
        toast.error(result.message ?? "Failed to post job");
      }
    },
    [],
  );

  // ── Applications ─────────────────────────────────────────────────────────
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const fetchApplications = useCallback(async () => {
    if (!isAuthenticated) return;
    setApplicationsLoading(true);
    const result = await listApplications({ limit: 100 });
    if (result.success) {
      setApplications((result.data ?? []).map((a) => toApplication(a)));
    }
    setApplicationsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAuthenticated) fetchApplications();
  }, [isAuthenticated, fetchApplications]);

  // Live socket: single application status update
  useEffect(() => {
    const unsub = onApplicationUpdated(
      (payload: SocketApplicationUpdatedPayload) => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === payload.application.id
              ? { ...app, status: payload.application.status }
              : app,
          ),
        );
      },
    );
    return unsub;
  }, [onApplicationUpdated]);

  // Live socket: batch application status update
  useEffect(() => {
    const unsub = onApplicationBatchUpdated(
      (payload: SocketBatchUpdatedPayload) => {
        const updateMap = new Map(
          payload.applications.map((a) => [a.id, a.status]),
        );
        setApplications((prev) =>
          prev.map((app) => {
            const newStatus = updateMap.get(app.id);
            return newStatus ? { ...app, status: newStatus } : app;
          }),
        );
      },
    );
    return unsub;
  }, [onApplicationBatchUpdated]);

  // Re-sync on reconnect (acceptance criterion #5)
  const { isConnected } = useSocketContext();
  const prevConnected = useRef(false);
  useEffect(() => {
    if (!prevConnected.current && isConnected && isAuthenticated) {
      // Transitioned from disconnected → connected: re-fetch to reconcile
      fetchApplications();
    }
    prevConnected.current = isConnected;
  }, [isConnected, isAuthenticated, fetchApplications]);

  const applyToJob = useCallback(
    async (jobId: string) => {
      const job = jobs.find((j) => j.id === jobId);
      if (!job) return;

      // Optimistic insert so the candidate sees "Pending" immediately
      const optimisticId = `optimistic-${Date.now()}`;
      const optimistic: Application = {
        id: optimisticId,
        candidateId: session?.user?.id ?? "",
        jobId,
        status: "PENDING",
        candidate: {
          id: session?.user?.id ?? "",
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
        },
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          employerId: job.employerId,
        },
        candidateName: session?.user?.name ?? "",
        candidateEmail: session?.user?.email ?? "",
        candidateInitials: (session?.user?.name ?? "U").charAt(0).toUpperCase(),
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        isNew: true,
      };
      setApplications((prev) => [optimistic, ...prev]);

      const result = await createApplication({ jobId });
      if (result.success) {
        // Replace optimistic row with real server response
        setApplications((prev) =>
          prev.map((app) =>
            app.id === optimisticId ? toApplication(result.data, true) : app,
          ),
        );
        toast.success(`Applied for ${job.title}!`);

        // Clear isNew flag after shimmer animation
        const realId = result.data.id;
        setTimeout(() => {
          setApplications((prev) =>
            prev.map((app) =>
              app.id === realId ? { ...app, isNew: false } : app,
            ),
          );
        }, 3000);
      } else {
        // Roll back the optimistic insert
        setApplications((prev) => prev.filter((app) => app.id !== optimisticId));
        toast.error(result.message ?? "Failed to submit application");
      }
    },
    [jobs, session?.user],
  );

  const updateApplicationStatus = useCallback(
    async (appId: string, status: ApplicationStatus) => {
      // Optimistic update
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status } : app)),
      );

      const result = await apiUpdateStatus(appId, status);
      if (!result.success) {
        // Roll back
        fetchApplications();
        toast.error(result.message ?? "Failed to update status");
      }
    },
    [fetchApplications],
  );

  // ── Batch selection ───────────────────────────────────────────────────────
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  // Keep a ref in sync inside an effect so we never read .current during render
  const selectedAppIdsRef = useRef<string[]>([]);
  useEffect(() => {
    selectedAppIdsRef.current = selectedAppIds;
  }, [selectedAppIds]);

  const toggleAppSelection = useCallback((appId: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId],
    );
  }, []);

  const selectAllApps = useCallback((appIds: string[]) => {
    setSelectedAppIds(appIds);
  }, []);

  const deselectAllApps = useCallback(() => {
    setSelectedAppIds([]);
  }, []);

  const batchUpdateStatus = useCallback(
    async (status: ApplicationStatus) => {
      const ids = selectedAppIdsRef.current;
      if (ids.length === 0) {
        toast.error("No applications selected.");
        return;
      }

      // Optimistic update on employer's own list immediately
      setApplications((prev) =>
        prev.map((app) => (ids.includes(app.id) ? { ...app, status } : app)),
      );
      setSelectedAppIds([]);

      const result = await apiBatchUpdate(ids, status);
      if (!result.success) {
        // Roll back
        fetchApplications();
        toast.error(result.message ?? "Batch update failed");
      } else {
        toast.success(
          `Updated ${result.data.length} application${result.data.length !== 1 ? "s" : ""} to ${STATUS_DISPLAY[status]}`,
        );
      }
    },
    [fetchApplications],
  );

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setNotificationsLoading(true);
    const result = await listNotifications({ limit: 50 });
    if (result.success) {
      setNotifications(
        (result.data ?? []).map((n) => ({
          id: n.id,
          userId: n.userId,
          type: n.type.toLowerCase(),
          title: n.title,
          message: n.message,
          date: n.createdAt,
          read: n.isRead,
        })),
      );
    }
    setNotificationsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated, fetchNotifications]);

  // Live socket: new notification
  useEffect(() => {
    const unsub = onNotificationNew((payload: SocketNotificationPayload) => {
      const n = payload.notification;
      setNotifications((prev) => {
        if (prev.some((existing) => existing.id === n.id)) return prev;
        return [
          {
            id: n.id,
            userId: n.userId,
            type: "general",
            title: n.title,
            message: n.message,
            date: n.createdAt,
            read: n.isRead,
          },
          ...prev,
        ];
      });
    });
    return unsub;
  }, [onNotificationNew]);

  const markNotificationsAsRead = useCallback(() => {
    const unreadIds = notifications
      .filter((n) => !n.read)
      .map((n) => n.id);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (unreadIds.length > 0) {
      markNotificationsRead(unreadIds).catch(() => {
        // Non-critical — local state is already optimistically updated
      });
    }
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        candidatePage,
        setCandidatePage,
        employerPage,
        setEmployerPage,
        profile,
        updateProfile,
        jobs,
        jobsLoading,
        applyToJob,
        postJob,
        applications,
        applicationsLoading,
        updateApplicationStatus,
        notifications,
        notificationsLoading,
        markNotificationsAsRead,
        selectedAppIds,
        setSelectedAppIds,
        toggleAppSelection,
        selectAllApps,
        deselectAllApps,
        batchUpdateStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextProps {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
