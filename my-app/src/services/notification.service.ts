import { notificationRepository } from "@/repositories/notification.repository";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { socketService } from "@/services/socket.service";
import type { NotificationQueryInput } from "@/lib/validations";
import type { AuthenticatedUser } from "@/types";

export const notificationService = {
  async listNotifications(user: AuthenticatedUser, query: NotificationQueryInput) {
    return notificationRepository.findManyForUser(user.id, query);
  },

  async markNotificationsRead(
    user: AuthenticatedUser,
    notificationIds: string[],
  ) {
    const result = await notificationRepository.markAsRead(
      notificationIds,
      user.id,
    );
    return { updated: result.count };
  },

  async markSingleNotificationRead(user: AuthenticatedUser, id: string) {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }
    if (notification.userId !== user.id) {
      throw new ForbiddenError("You can only mark your own notifications as read");
    }

    const result = await notificationRepository.markAsRead([id], user.id);
    return { updated: result.count };
  },

  async createAndNotify(
    userId: string,
    title: string,
    message: string,
  ) {
    const notification = await notificationRepository.create({
      userId,
      title,
      message,
    });

    socketService.emitNotificationNew(userId, {
      notification: {
        id: notification.id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
      },
    });

    return notification;
  },
};
