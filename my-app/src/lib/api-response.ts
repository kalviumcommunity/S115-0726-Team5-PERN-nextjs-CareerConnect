import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function errorResponse(
  message: string,
  status = 500,
  code?: string,
  details?: unknown,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false, error: message, ...(code ? { code } : {}), ...(details ? { details } : {}) },
    { status },
  );
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ValidationError) {
    return errorResponse(error.message, error.statusCode, error.code, error.details);
  }

  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode, error.code);
  }

  if (error instanceof ZodError) {
    return errorResponse("Validation failed", 400, "VALIDATION_ERROR", error.flatten());
  }

  logger.error({ err: error }, "Unhandled API error");
  return errorResponse("Internal server error", 500, "INTERNAL_ERROR");
}

export function paginatedMeta(
  page: number,
  limit: number,
  total: number,
): Record<string, unknown> {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
