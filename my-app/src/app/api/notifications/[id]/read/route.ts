import { NextRequest } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/api-response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const result = await notificationService.markSingleNotificationRead(
      user,
      id,
    );

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
