"use client";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";

// ─── Shared notification shape returned by the API ───────────────────────────

export interface ApiNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
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
 * List notifications for the authenticated user from GET /api/notifications.
 */
export async function listNotifications(
  params: NotificationQueryParams = {},
): Promise<ApiSuccessResponse<ApiNotification[]> | ApiErrorResponse> {
  const qs = buildQueryString(params as Record<string, unknown>);
  const res = await fetch(`/api/notifications${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json() as Promise<ApiSuccessResponse<ApiNotification[]> | ApiErrorResponse>;
}

/**
 * Mark specific notifications as read via POST /api/notifications/read.
 */
export async function markNotificationsRead(
  notificationIds: string[],
): Promise<ApiSuccessResponse<{ updated: number }> | ApiErrorResponse> {
  const res = await fetch("/api/notifications/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationIds }),
  });
  return res.json() as Promise<
    ApiSuccessResponse<{ updated: number }> | ApiErrorResponse
  >;
}

/**
 * Mark a single notification as read via POST /api/notifications/[id]/read.
 */
export async function markNotificationRead(
  id: string,
): Promise<ApiSuccessResponse<{ updated: number }> | ApiErrorResponse> {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json() as Promise<
    ApiSuccessResponse<{ updated: number }> | ApiErrorResponse
  >;
}
