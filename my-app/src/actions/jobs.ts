"use client";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";

// ─── Shared job shape returned by the API ────────────────────────────────────

export interface ApiJob {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  experienceLevel: string;
  experience?: string;
  category: string;
  skills: string[];
  isActive: boolean;
  employerId: string;
  companyId?: string | null;
  companyRef?: {
    id: string;
    name: string;
    logo?: string | null;
    industry?: string | null;
  } | null;
  employer: {
    id: string;
    name: string;
    email: string;
  };
  _count?: { applications: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface JobQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  category?: string;
  isActive?: boolean;
  sort?: string;
  order?: "asc" | "desc";
  employerId?: string;
}

export type CreateJobPayload = {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType?: string;
  experienceLevel?: string;
  experience?: string;
  category?: string;
  skills?: string[];
  companyId?: string;
};

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
 * List jobs from GET /api/jobs with optional filters.
 */
export async function listJobs(
  params: JobQueryParams = {},
): Promise<ApiSuccessResponse<ApiJob[]> | ApiErrorResponse> {
  const qs = buildQueryString(params as Record<string, unknown>);
  const res = await fetch(`/api/jobs${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json() as Promise<ApiSuccessResponse<ApiJob[]> | ApiErrorResponse>;
}

/**
 * Fetch a single job by id from GET /api/jobs/[id].
 */
export async function getJob(
  id: string,
): Promise<ApiSuccessResponse<ApiJob> | ApiErrorResponse> {
  const res = await fetch(`/api/jobs/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json() as Promise<ApiSuccessResponse<ApiJob> | ApiErrorResponse>;
}

/**
 * Create a new job via POST /api/jobs. Requires EMPLOYER session.
 */
export async function createJob(
  payload: CreateJobPayload,
): Promise<ApiSuccessResponse<ApiJob> | ApiErrorResponse> {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<ApiSuccessResponse<ApiJob> | ApiErrorResponse>;
}
