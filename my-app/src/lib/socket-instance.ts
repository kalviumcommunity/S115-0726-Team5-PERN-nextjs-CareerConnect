import type { Server as IOServer } from "socket.io";

// The Socket.IO server is created once in server.ts (Next.js API routes
// can't hold a persistent WebSocket server on their own). We stash the
// instance here so services running inside API routes can emit events
// without needing to pass `io` through every function call.
const globalForSocket = globalThis as unknown as { io: IOServer | undefined };

export function setSocketServer(io: IOServer) {
  globalForSocket.io = io;
}

export function getSocketServer(): IOServer | null {
  return globalForSocket.io ?? null;
}
