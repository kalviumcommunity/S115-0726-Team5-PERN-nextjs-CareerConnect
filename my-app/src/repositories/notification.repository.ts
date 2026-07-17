import { prisma } from "@/lib/prisma";

export const notificationRepository = {
  create(data: { userId: string; title: string; message: string }) {
    return prisma.notification.create({ data });
  },

  createMany(data: { userId: string; title: string; message: string }[]) {
    return prisma.notification.createMany({ data });
  },

  async findByUser(userId: string, page: number, limit: number) {
    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { items, total, unreadCount };
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  markManyRead(userId: string, ids: string[]) {
    return prisma.notification.updateMany({
      where: { userId, id: { in: ids } },
      data: { isRead: true },
    });
  },
};
