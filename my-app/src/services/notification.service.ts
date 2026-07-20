import { notificationRepository } from "@/repositories/notification.repository";

export const notificationService = {
  async list(userId: string, page: number, limit: number) {
    const { items, total, unreadCount } = await notificationRepository.findByUser(
      userId,
      page,
      limit
    );
    return {
      notifications: items,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async markRead(userId: string, notificationIds?: string[]) {
    if (notificationIds && notificationIds.length > 0) {
      const result = await notificationRepository.markManyRead(userId, notificationIds);
      return result.count;
    }
    const result = await notificationRepository.markAllRead(userId);
    return result.count;
  },
};
