import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { RegisterSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";
import { parseBody } from "@/utils/parse-request";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = parseBody(RegisterSchema, body);
    const user = await authService.register(input);

    logger.info({ userId: user.id, role: user.role }, "User registered");
    return successResponse(user, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
