import { markNotificationsReadSchema } from "@/lib/validations";
import { notificationService } from "@/services/notification.service";
import { requireUser } from "@/lib/session";
import { successResponse, withErrorHandling } from "@/lib/api-response";

// PATCH /api/notifications/read
// Body: { notificationIds?: string[] }  — omit to mark ALL as read
export const PATCH = withErrorHandling(async (req: Request) => {
  const user = await requireUser();
  const body = await req.json().catch(() => ({}));
  const { notificationIds } = markNotificationsReadSchema.parse(body);
  const count = await notificationService.markRead(user.id, notificationIds);
  return successResponse({ markedRead: count });
});
