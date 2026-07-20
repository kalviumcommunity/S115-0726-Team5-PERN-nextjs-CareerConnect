import { getSocketServer } from "@/lib/socket-instance";
import { logger } from "@/lib/logger";
import type { Application, Notification } from "@prisma/client";

function userRoom(userId: string) {
  return `user:${userId}`;
}

export const socketService = {
  /**
   * Notify a single candidate that one of their applications changed status.
   */
  emitApplicationUpdated(candidateId: string, application: Application & { job?: { title: string; company: string } }) {
    const io = getSocketServer();
    if (!io) {
      logger.warn("Socket.IO server not initialized; skipping emit");
      return;
    }
    io.to(userRoom(candidateId)).emit("application:updated", { application });
  },

  /**
   * Notify multiple candidates after an employer batch-updates statuses.
   * Each candidate only receives events for their own applications.
   */
  emitBatchApplicationsUpdated(
    applications: (Application & { job?: { title: string; company: string } })[]
  ) {
    const io = getSocketServer();
    if (!io) {
      logger.warn("Socket.IO server not initialized; skipping emit");
      return;
    }
    for (const application of applications) {
      io.to(userRoom(application.candidateId)).emit("application:batch-updated", {
        application,
      });
    }
  },

  emitNewNotification(userId: string, notification: Notification) {
    const io = getSocketServer();
    if (!io) {
      logger.warn("Socket.IO server not initialized; skipping emit");
      return;
    }
    io.to(userRoom(userId)).emit("notification:new", { notification });
  },
};
