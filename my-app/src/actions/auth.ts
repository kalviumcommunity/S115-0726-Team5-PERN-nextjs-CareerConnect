"use client";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "CANDIDATE" | "EMPLOYER";
};

type RegisterResult = {
  id: string;
  name: string;
  email: string;
  role: string;
};

/**
 * Register a new user account via POST /api/auth/register.
 * Returns the success/error response from the API.
 */
export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiSuccessResponse<RegisterResult> | ApiErrorResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json() as Promise<ApiSuccessResponse<RegisterResult> | ApiErrorResponse>;
}
