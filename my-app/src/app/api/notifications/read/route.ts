import { NextRequest } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/lib/auth";
import { MarkNotificationsReadSchema } from "@/lib/validations";
import { handleApiError, successResponse } from "@/lib/api-response";
import { parseBody } from "@/utils/parse-request";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const input = parseBody(MarkNotificationsReadSchema, body);
    const result = await notificationService.markNotificationsRead(
      user,
      input.notificationIds,
    );

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
