"use client";

import type { ApiErrorResponse, ApiSuccessResponse, ApplicationStatus } from "@/types";

// ─── Shared application shape returned by the API ────────────────────────────

export interface ApiApplication {
  id: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  coverLetter?: string | null;
  createdAt?: string;
  updatedAt?: string;
  candidate: {
    id: string;
    name: string;
    email: string;
  };
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    employerId: string;
  };
}

export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  jobId?: string;
}

function buildQueryString(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      qs.set(k, String(v));
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

/**
 * List applications from GET /api/applications.
 * Scoped server-side by the authenticated user's role.
 */
export async function listApplications(
  params: ApplicationQueryParams = {},
): Promise<ApiSuccessResponse<ApiApplication[]> | ApiErrorResponse> {
  const qs = buildQueryString(params as Record<string, unknown>);
  const res = await fetch(`/api/applications${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json() as Promise<ApiSuccessResponse<ApiApplication[]> | ApiErrorResponse>;
}

/**
 * Fetch a single application by id from GET /api/applications/[id].
 */
export async function getApplication(
  id: string,
): Promise<ApiSuccessResponse<ApiApplication> | ApiErrorResponse> {
  const res = await fetch(`/api/applications/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json() as Promise<ApiSuccessResponse<ApiApplication> | ApiErrorResponse>;
}

/**
 * Submit a new application via POST /api/applications. Requires CANDIDATE session.
 */
export async function createApplication(payload: {
  jobId: string;
  coverLetter?: string;
}): Promise<ApiSuccessResponse<ApiApplication> | ApiErrorResponse> {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<ApiSuccessResponse<ApiApplication> | ApiErrorResponse>;
}

/**
 * Update the status of a single application via PATCH /api/applications/[id].
 * Requires EMPLOYER session.
 */
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<ApiSuccessResponse<ApiApplication> | ApiErrorResponse> {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json() as Promise<ApiSuccessResponse<ApiApplication> | ApiErrorResponse>;
}

/**
 * Batch-update the status of multiple applications via PATCH /api/applications/batch-update.
 * Requires EMPLOYER session.
 */
export async function batchUpdateApplicationStatus(
  applicationIds: string[],
  status: ApplicationStatus,
): Promise<ApiSuccessResponse<ApiApplication[]> | ApiErrorResponse> {
  const res = await fetch("/api/applications/batch-update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationIds, status }),
  });
  return res.json() as Promise<ApiSuccessResponse<ApiApplication[]> | ApiErrorResponse>;
}
