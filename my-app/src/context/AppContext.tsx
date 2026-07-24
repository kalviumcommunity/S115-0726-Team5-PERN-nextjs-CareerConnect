"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
export type Role = "candidate" | "employer" | "guest";

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

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  skills: string[];
  description: string;
  applied?: boolean;
}

export interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateInitials: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "Pending" | "Shortlisted" | "In Review" | "Rejected" | "Hired";
  resumeUrl: string;
  skills?: string[];
  experience?: string;
  education?: string;
  bio?: string;
}

export interface AppNotification {
  id: string;
  type: "viewed" | "rejected" | "accepted" | "new_application";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface AppContextProps {
  role: Role;
  setRole: (role: Role) => void;
  candidatePage: string;
  setCandidatePage: (page: string) => void;
  employerPage: string;
  setEmployerPage: (page: string) => void;
  profile: CandidateProfile;
  updateProfile: (updated: Partial<CandidateProfile>) => void;
  jobs: Job[];
  applyToJob: (jobId: string) => void;
  postJob: (job: Omit<Job, "id">) => void;
  applications: Application[];
  updateApplicationStatus: (appId: string, status: Application["status"]) => void;
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>("guest");
  const [candidatePage, setCandidatePage] = useState<string>("dashboard");
  const [employerPage, setEmployerPage] = useState<string>("dashboard");
  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    if (newRole === "candidate") {
      setCandidatePage("dashboard");
    } else if (newRole === "employer") {
      setEmployerPage("dashboard");
    }
  }, []);
  const [profile, setProfile] = useState<CandidateProfile>({
    name: "Devansh Pujari",
    email: "devansh.pujari@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    dob: "12 Jan 2003",
    status: "Actively looking for opportunities",
    bio: "Passionate and detail-oriented developer with a strong foundation in building scalable web applications.",
    avatar: "DP",
    resumeName: "Devansh_Pujari_Resume.pdf",
    resumeUpdated: "08 May 2025",
    skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git", "REST API"],
    preferences: {
      roles: ["Frontend Developer", "UI/UX Designer"],
      locations: ["Bangalore", "Hyderabad", "Pune"],
      jobTypes: "Full-time",
      experience: "1 - 3 Years",
    },
  });
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job-1",
      title: "Frontend Developer",
      company: "Tech Solutions",
      location: "Bangalore, India",
      salary: "â‚¹8L - â‚¹12L",
      experience: "1 - 3 Years",
      skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
      description: "We are looking for a passionate Frontend Developer to build beautiful, responsive web applications using React and Tailwind CSS.",
    },
    {
      id: "job-2",
      title: "UI/UX Designer",
      company: "Tech Solutions",
      location: "Bangalore, India",
      salary: "â‚¹6L - â‚¹10L",
      experience: "1 - 3 Years",
      skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
      description: "Join our creative team to craft engaging, user-centered digital interfaces for web and mobile products.",
    },
    {
      id: "job-3",
      title: "Full Stack Developer",
      company: "Tech Solutions",
      location: "Bangalore, India",
      salary: "â‚¹12L - â‚¹18L",
      experience: "3 - 5 Years",
      skills: ["React", "Node.js", "Express.js", "MongoDB"],
      description: "Looking for an experienced developer capable of handling both client-side and server-side logic in a MERN stack environment.",
    },
    {
      id: "job-4",
      title: "Backend Developer",
      company: "Tech Solutions",
      location: "Bangalore, India",
      salary: "â‚¹10L - â‚¹15L",
      experience: "2 - 4 Years",
      skills: ["Node.js", "Express.js", "PostgreSQL", "Redis"],
      description: "Build robust, scalable APIs and microservices. Ensure high performance and low latency of backend requests.",
    },
    {
      id: "job-5",
      title: "DevOps Engineer",
      company: "Tech Solutions",
      location: "Bangalore, India",
      salary: "â‚¹14L - â‚¹20L",
      experience: "3 - 5 Years",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      description: "Manage and optimize cloud deployment pipelines. Monitor application uptime, scaling, and system health.",
    },
  ]);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app-1",
      candidateName: "Rohit Kumar",
      candidateEmail: "rohit.kumar@email.com",
      candidatePhone: "+91 98765 43210",
      candidateInitials: "RK",
      jobTitle: "Frontend Developer",
      company: "Tech Solutions",
      appliedDate: "08 May 2025",
      status: "Pending",
      resumeUrl: "Rohit_Kumar_Resume.pdf",
      skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Git", "REST APIs", "Figma"],
      experience: "Frontend Developer at Tech Solutions (Jan 2023 - Present)\nFrontend Developer at Webcraft Technologies (Aug 2021 - Dec 2022)",
      education: "Bachelor of Computer Applications (BCA) at Christ University, Bangalore (2018 - 2021)",
      bio: "Passionate Frontend Developer with 3+ years of experience building responsive, user-friendly web applications. Skilled in React, JavaScript, TypeScript, HTML5, CSS3, and modern CSS frameworks. Strong problem-solving abilities and a keen eye for detail."
    },
    {
      id: "app-2",
      candidateName: "Ananya Singh",
      candidateEmail: "ananya.singh@email.com",
      candidatePhone: "+91 98765 43211",
      candidateInitials: "AS",
      jobTitle: "UI/UX Designer",
      company: "Tech Solutions",
      appliedDate: "07 May 2025",
      status: "Pending",
      resumeUrl: "Ananya_Singh_Portfolio.pdf",
      skills: ["Figma", "Sketch", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Design Systems"],
      experience: "UI/UX Designer at Creative Studio (Jul 2023 - Present)\nJunior Product Designer at AppForge (Sep 2022 - Jun 2023)",
      education: "Bachelor of Design (B.Des) at National Institute of Design (2018 - 2022)",
      bio: "Detail-oriented Product Designer focusing on creating intuitive interfaces and delightful user journeys. Specialized in mobile applications and design system creation."
    },
    {
      id: "app-3",
      candidateName: "Manish Patel",
      candidateEmail: "manish.patel@email.com",
      candidatePhone: "+91 98765 43212",
      candidateInitials: "MP",
      jobTitle: "Full Stack Developer",
      company: "Tech Solutions",
      appliedDate: "06 May 2025",
      status: "Shortlisted",
      resumeUrl: "Manish_Patel_Resume.pdf",
      skills: ["React", "Node.js", "Express.js", "MongoDB", "Redux", "Docker", "AWS", "Next.js"],
      experience: "Full Stack Engineer at ByteCode Corp (Mar 2022 - Present)\nSoftware Developer Intern at TechLab (Jan 2021 - Feb 2022)",
      education: "B.Tech in Computer Science at NIT Trichy (2018 - 2022)",
      bio: "Versatile Full Stack Developer with experience in MERN stack. Interested in system architecture, API optimization, and CI/CD pipelines."
    },
    {
      id: "app-4",
      candidateName: "Sneha Reddy",
      candidateEmail: "sneha.reddy@email.com",
      candidatePhone: "+91 98765 43213",
      candidateInitials: "SR",
      jobTitle: "Backend Developer",
      company: "Tech Solutions",
      appliedDate: "05 May 2025",
      status: "In Review",
      resumeUrl: "Sneha_Reddy_Resume.pdf",
      skills: ["Node.js", "Python", "Django", "PostgreSQL", "Redis", "Kafka", "Docker", "GraphQL"],
      experience: "Backend Developer at DataFlow Systems (Nov 2022 - Present)\nPython Developer at PyTech Solutions (Jun 2021 - Oct 2022)",
      education: "M.Tech in Software Engineering at IIIT Bangalore (2019 - 2021)",
      bio: "Backend specialist with passion for writing clean, optimized code. Expert in database design, caching mechanisms, and distributed message queues."
    },
    {
      id: "app-5",
      candidateName: "Nikhil Purohit",
      candidateEmail: "nikhil.purohit@email.com",
      candidatePhone: "+91 98765 43214",
      candidateInitials: "NP",
      jobTitle: "DevOps Engineer",
      company: "Tech Solutions",
      appliedDate: "04 May 2025",
      status: "Rejected",
      resumeUrl: "Nikhil_Purohit_Resume.pdf",
      skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Jenkins", "GitHub Actions", "Prometheus", "Grafana"],
      experience: "DevOps Engineer at CloudScale Ltd (Feb 2023 - Present)\nSystems Administrator at WebHosting India (May 2021 - Jan 2023)",
      education: "B.Sc in Computer Science at Delhi University (2018 - 2021)",
      bio: "Infrastructure Automation Architect. Passionate about infrastructure as code, cloud cost optimization, and establishing high-availability production metrics."
    },
    {
      id: "app-6",
      candidateName: "Pooja Kapoor",
      candidateEmail: "pooja.kapoor@email.com",
      candidatePhone: "+91 98765 43215",
      candidateInitials: "PK",
      jobTitle: "UI/UX Designer",
      company: "Tech Solutions",
      appliedDate: "03 May 2025",
      status: "Hired",
      resumeUrl: "Pooja_Kapoor_Portfolio.pdf",
      skills: ["Figma", "Adobe XD", "Wireframing", "Interaction Design", "Responsive Design", "Heuristic Evaluation"],
      experience: "Interaction Designer at Pixel Perfect Agency (Apr 2023 - Present)\nUI Designer at InnoApp Studios (May 2021 - Mar 2023)",
      education: "B.Des in Communication Design at NIFT Mumbai (2017 - 2021)",
      bio: "User Experience Designer who bridges the gap between user needs and business objectives. Experienced in user interviews, high-fidelity mockups, and usability testing."
    },
    {
      id: "app-dev-1",
      candidateName: "Devansh Pujari",
      candidateEmail: "devansh.pujari@example.com",
      candidatePhone: "+91 98765 43210",
      candidateInitials: "DP",
      jobTitle: "UI/UX Designer",
      company: "Tech Solutions",
      appliedDate: "07 May 2025",
      status: "Shortlisted",
      resumeUrl: "Devansh_Pujari_Resume.pdf",
      skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git", "REST API"],
      experience: "Passionate Frontend Developer with 2 years of experience.",
      education: "Bachelor of Computer Applications (BCA) at Christ University (2020 - 2023)",
      bio: "Passionate and detail-oriented developer with a strong foundation in building scalable web applications."
    },
    {
      id: "app-dev-2",
      candidateName: "Devansh Pujari",
      candidateEmail: "devansh.pujari@example.com",
      candidatePhone: "+91 98765 43210",
      candidateInitials: "DP",
      jobTitle: "Frontend Developer",
      company: "Tech Solutions",
      appliedDate: "08 May 2025",
      status: "Pending",
      resumeUrl: "Devansh_Pujari_Resume.pdf",
      skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git", "REST API"],
      experience: "Passionate Frontend Developer with 2 years of experience.",
      education: "Bachelor of Computer Applications (BCA) at Christ University (2020 - 2023)",
      bio: "Passionate and detail-oriented developer with a strong foundation in building scalable web applications."
    },
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "notif-1",
      type: "viewed",
      title: "Application Viewed",
      message: "Tech Solutions viewed your application for Frontend Developer.",
      date: "08 May 2025",
      read: false,
    },
    {
      id: "notif-2",
      type: "accepted",
      title: "Application Shortlisted",
      message: "Congratulations! You have been shortlisted by Tech Solutions for UI/UX Designer.",
      date: "07 May 2025",
      read: false,
    },
    {
      id: "notif-3",
      type: "rejected",
      title: "Application Status Update",
      message: "Thank you for your interest in Tech Solutions. We regret to inform you that your application for DevOps Engineer has been rejected.",
      date: "04 May 2025",
      read: true,
    },
  ]);
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const applicationsRef = useRef(applications);
  applicationsRef.current = applications;
  const jobsRef = useRef(jobs);
  jobsRef.current = jobs;
  const updateProfile = useCallback((updated: Partial<CandidateProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    toast.success("Profile updated successfully!");
  }, []);
  const applyToJob = useCallback((jobId: string) => {
    const job = jobsRef.current.find((j) => j.id === jobId);
    if (!job) return;

    if (job.applied) {
      toast.error("You have already applied to this job.");
      return;
    }

    const p = profileRef.current;
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, applied: true } : j))
    );
    const newApp: Application = {
      id: `app-${Date.now()}`,
      candidateName: p.name,
      candidateEmail: p.email,
      candidatePhone: p.phone,
      candidateInitials: p.avatar,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pending",
      resumeUrl: p.resumeName,
      skills: p.skills,
      experience: "Candidate profile simulated experience",
      education: "Candidate profile simulated education",
      bio: p.bio,
    };

    setApplications((prevApps) => [newApp, ...prevApps]);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: "new_application",
      title: "New Application Received",
      message: `${p.name} applied for your job: ${job.title}.`,
      date: "Today",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toast.success(`Successfully applied for ${job.title}!`);
  }, []);
  const postJob = useCallback((jobData: Omit<Job, "id">) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
    };
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    toast.success("New job posted successfully!");
  }, []);
  const updateApplicationStatus = useCallback((appId: string, status: Application["status"]) => {
    setApplications((prevApps) =>
      prevApps.map((app) => (app.id === appId ? { ...app, status } : app))
    );
    const app = applicationsRef.current.find((a) => a.id === appId);
    if (app) {
      let type: AppNotification["type"] = "viewed";
      let title = "Application Update";
      let message = `Your application status for ${app.jobTitle} at ${app.company} has been updated to ${status}.`;

      if (status === "Shortlisted" || status === "Hired") {
        type = "accepted";
        title = `Application ${status}!`;
        message = `Congratulations! You have been ${status.toLowerCase()} by ${app.company} for the ${app.jobTitle} role.`;
      } else if (status === "Rejected") {
        type = "rejected";
        title = "Application Rejected";
        message = `We appreciate your time, but ${app.company} has updated your application for ${app.jobTitle} to Rejected.`;
      } else if (status === "In Review") {
        type = "viewed";
        title = "Application In Review";
        message = `${app.company} has updated your application for ${app.jobTitle} to In Review.`;
      }

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        type,
        title,
        message,
        date: "Just now",
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);
    }

    toast.success(`Application status updated to ${status}`);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

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
        applyToJob,
        postJob,
        applications,
        updateApplicationStatus,
        notifications,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
