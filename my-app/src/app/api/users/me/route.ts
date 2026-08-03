import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { UpdateUserProfileSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";
import { parseBody } from "@/utils/parse-request";
import { NotFoundError } from "@/lib/errors";

export async function GET() {
  try {
    const authUser = await requireAuth();
    const user = await userRepository.findById(authUser.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    // Remove password before returning
    const { password: _, ...safeUser } = user;
    return successResponse(safeUser);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await requireAuth();
    const body = await request.json();
    const input = parseBody(UpdateUserProfileSchema, body);
    const user = await userRepository.update(authUser.id, input);
    const { password: _, ...safeUser } = user;
    return successResponse(safeUser);
  } catch (error) {
    return handleApiError(error);
  }
}
