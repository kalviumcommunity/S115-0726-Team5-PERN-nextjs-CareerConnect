import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "./logger";

/**
 * Thrown by services when a business rule is violated (not found,
 * forbidden, conflict, etc). Routes catch this and translate it into
 * a consistent JSON error response.
 */
export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code = "API_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "ApiError";
  }

  static badRequest(message = "Bad request") {
    return new ApiError(400, message, "BAD_REQUEST");
  }
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message, "UNAUTHORIZED");
  }
  static forbidden(message = "Forbidden") {
    return new ApiError(403, message, "FORBIDDEN");
  }
  static notFound(message = "Not found") {
    return new ApiError(404, message, "NOT_FOUND");
  }
  static conflict(message = "Conflict") {
    return new ApiError(409, message, "CONFLICT");
  }
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500, code = "INTERNAL_ERROR") {
  return NextResponse.json(
    { success: false, error: { message, code } },
    { status }
  );
}

/**
 * Wrap a route handler so every route gets consistent error handling
 * without repeating try/catch boilerplate in every file.
 */
export function withErrorHandling(
  handler: (req: Request, ctx: any) => Promise<NextResponse>
) {
  return async (req: Request, ctx: any) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ZodError) {
        return errorResponse(
          err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
          400,
          "VALIDATION_ERROR"
        );
      }
      if (err instanceof ApiError) {
        return errorResponse(err.message, err.statusCode, err.code);
      }
      logger.error({ err }, "Unhandled error in API route");
      return errorResponse("Something went wrong", 500, "INTERNAL_ERROR");
    }
  };
}
