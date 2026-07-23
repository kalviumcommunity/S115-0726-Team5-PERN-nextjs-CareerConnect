import { getIO } from "@/socket/emitter";
import { logger } from "@/lib/logger";
import type {
  SocketApplicationUpdatedPayload,
  SocketBatchUpdatedPayload,
  SocketNotificationPayload,
} from "@/types";

function userRoom(userId: string): string {
  return `user:${userId}`;
}

export const socketService = {
  emitApplicationUpdated(
    candidateId: string,
    payload: SocketApplicationUpdatedPayload,
  ) {
    const io = getIO();
    if (!io) {
      logger.warn("Socket.IO not initialized; skipping application:updated emit");
      return;
    }
    io.to(userRoom(candidateId)).emit("application:updated", payload);
  },

  emitNotificationNew(userId: string, payload: SocketNotificationPayload) {
    const io = getIO();
    if (!io) {
      logger.warn("Socket.IO not initialized; skipping notification:new emit");
      return;
    }
    io.to(userRoom(userId)).emit("notification:new", payload);
  },

  emitApplicationBatchUpdated(
    candidateIds: string[],
    payload: SocketBatchUpdatedPayload,
  ) {
    const io = getIO();
    if (!io) {
      logger.warn(
        "Socket.IO not initialized; skipping application:batch-updated emit",
      );
      return;
    }

    const uniqueCandidateIds = [...new Set(candidateIds)];
    for (const candidateId of uniqueCandidateIds) {
      io.to(userRoom(candidateId)).emit("application:batch-updated", payload);
    }
  },
};
