import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types";

// ─── Success Responses ───────────────────────────────────────────────────────

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>,
  message = "Success",
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { success: true as const, message, data, ...(meta ? { meta } : {}) },
    { status },
  );
}

// ─── Error Responses ─────────────────────────────────────────────────────────

export function errorResponse(
  message: string,
  status = 500,
  errors?: Array<{ field?: string; message: string }>,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      message,
      ...(errors && errors.length > 0 ? { errors } : {}),
    },
    { status },
  );
}

// ─── Central Error Handler ───────────────────────────────────────────────────

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ValidationError) {
    const zodErrors = error.details as { fieldErrors?: Record<string, string[]> } | undefined;
    const errors: Array<{ field?: string; message: string }> = [];
    let detailedMessage = error.message;

    if (zodErrors?.fieldErrors) {
      const parts = [];
      for (const [field, messages] of Object.entries(zodErrors.fieldErrors)) {
        for (const msg of messages as string[]) {
          errors.push({ field, message: msg });
          parts.push(`${field}: ${msg}`);
        }
      }
      if (parts.length > 0) detailedMessage += " - " + parts.join(", ");
    }

    return errorResponse(detailedMessage, error.statusCode, errors);
  }

  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return errorResponse("Validation failed", 400, errors);
  }

  logger.error({ err: error }, "Unhandled API error");
  return errorResponse("Internal server error", 500);
}

// ─── Pagination Helper ──────────────────────────────────────────────────────

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
