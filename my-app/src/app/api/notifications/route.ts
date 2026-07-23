import { NextRequest } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/lib/auth";
import { NotificationQuerySchema } from "@/lib/validations";
import {
  handleApiError,
  paginatedMeta,
  successResponse,
} from "@/lib/api-response";
import { parseQuery } from "@/utils/parse-request";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const query = parseQuery(
      NotificationQuerySchema,
      request.nextUrl.searchParams,
    );
    const result = await notificationService.listNotifications(user, query);

    return successResponse(
      result.items,
      200,
      paginatedMeta(result.page, result.limit, result.total),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
