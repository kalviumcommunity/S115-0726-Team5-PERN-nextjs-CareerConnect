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

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const RELAY_SECRET = process.env.SOCKET_RELAY_SECRET;

/**
 * Relays an event to the standalone socket service via HTTP.
 * Returns `true` if a relay was attempted (success or failure) — `false` means
 * "no relay configured, use the in-process io instead" (local dev / unified server).
 */
async function relay(
  event: string,
  room: string,
  payload: unknown,
): Promise<boolean> {
  if (!SOCKET_URL) return false;

  try {
    const res = await fetch(`${SOCKET_URL}/emit`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-secret": RELAY_SECRET ?? "",
      },
      body: JSON.stringify({ event, room, payload }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, `Socket relay failed for ${event}`);
    }
  } catch (err) {
    logger.warn({ err }, `Socket relay request failed for ${event}`);
  }

  return true;
}

export const socketService = {
  async emitApplicationUpdated(
    candidateId: string,
    payload: SocketApplicationUpdatedPayload,
  ) {
    const room = userRoom(candidateId);
    if (await relay("application:updated", room, payload)) return;

    const io = getIO();
    if (!io) {
      logger.warn(
        "Socket.IO not initialized; skipping application:updated emit",
      );
      return;
    }
    io.to(room).emit("application:updated", payload);
  },

  async emitNotificationNew(
    userId: string,
    payload: SocketNotificationPayload,
  ) {
    const room = userRoom(userId);
    if (await relay("notification:new", room, payload)) return;

    const io = getIO();
    if (!io) {
      logger.warn(
        "Socket.IO not initialized; skipping notification:new emit",
      );
      return;
    }
    io.to(room).emit("notification:new", payload);
  },

  async emitApplicationBatchUpdated(
    candidateIds: string[],
    payload: SocketBatchUpdatedPayload,
  ) {
    const uniqueCandidateIds = [...new Set(candidateIds)];

    if (SOCKET_URL) {
      await Promise.all(
        uniqueCandidateIds.map((id) =>
          relay("application:batch-updated", userRoom(id), payload),
        ),
      );
      return;
    }

    const io = getIO();
    if (!io) {
      logger.warn(
        "Socket.IO not initialized; skipping application:batch-updated emit",
      );
      return;
    }
    for (const candidateId of uniqueCandidateIds) {
      io.to(userRoom(candidateId)).emit("application:batch-updated", payload);
    }
  },
};
