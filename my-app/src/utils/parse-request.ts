import { ZodSchema } from "zod";
import { ValidationError } from "@/lib/errors";

export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError("Validation failed", result.error.flatten());
  }
  return result.data;
}

export function parseQuery<T>(
  schema: ZodSchema<T>,
  searchParams: URLSearchParams,
): T {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);
  if (!result.success) {
    throw new ValidationError("Invalid query parameters", result.error.flatten());
  }
  return result.data;
}
