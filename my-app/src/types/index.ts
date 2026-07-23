import { Role } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

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
