import { NotificationType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { NotificationQueryInput } from "@/lib/validations";

export const notificationRepository = {
  create(data: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
  }) {
    return prisma.notification.create({ data });
  },

  createMany(
    data: Array<{
      userId: string;
      title: string;
      message: string;
      type?: NotificationType;
    }>,
  ) {
    return prisma.notification.createMany({ data });
  },

  findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  },

  async findManyForUser(userId: string, query: NotificationQueryInput) {
    const { page, limit, isRead } = query;
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(isRead !== undefined ? { isRead } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  markAsRead(ids: string[], userId: string) {
    return prisma.notification.updateMany({
      where: { id: { in: ids }, userId },
      data: { isRead: true },
    });
  },

  markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  },
};
