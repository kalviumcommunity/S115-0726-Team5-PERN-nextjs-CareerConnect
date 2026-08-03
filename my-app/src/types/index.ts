import type {
  Role,
  ApplicationStatus,
  JobType,
  ExperienceLevel,
  JobCategory,
  NotificationType,
} from "@prisma/client";

// Re-export Prisma enums for convenience
export type {
  Role,
  ApplicationStatus,
  JobType,
  ExperienceLevel,
  JobCategory,
  NotificationType,
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Socket.IO Payloads ─────────────────────────────────────────────────────

export type ApplicationStatusType =
  | "PENDING"
  | "VIEWED"
  | "SHORTLISTED"
  | "REJECTED"
  | "ACCEPTED";

export interface SocketApplicationUpdatedPayload {
  application: {
    id: string;
    candidateId: string;
    jobId: string;
    status: ApplicationStatusType;
    updatedAt: string;
    job?: {
      id: string;
      title: string;
      company: string;
    };
  };
}

export interface SocketNotificationPayload {
  notification: {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  };
}

export interface SocketBatchUpdatedPayload {
  applications: Array<{
    id: string;
    candidateId: string;
    jobId: string;
    status: ApplicationStatusType;
    updatedAt: string;
  }>;
  status: ApplicationStatusType;
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}
