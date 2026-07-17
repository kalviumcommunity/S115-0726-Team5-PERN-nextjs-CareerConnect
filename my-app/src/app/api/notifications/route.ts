import { notificationService } from "@/services/notification.service";
import { requireUser } from "@/lib/session";
import { successResponse, withErrorHandling } from "@/lib/api-response";

// GET /api/notifications?page=&limit=
export const GET = withErrorHandling(async (req: Request) => {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const result = await notificationService.list(user.id, page, limit);
  return successResponse(result);
});
