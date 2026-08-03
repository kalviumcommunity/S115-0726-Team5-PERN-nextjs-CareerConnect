import { Server } from "socket.io";
import { setIO } from "./emitter";
import { logger } from "@/lib/logger";
// Using require() because the jsonwebtoken package lacks a proper ESM export
const jwt = require("jsonwebtoken") as { verify: (t: string, s: string) => Record<string, unknown> };

export function initSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? process.env.NEXTAUTH_URL : "*",
      methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      if (!process.env.NEXTAUTH_SECRET) {
        logger.error("NEXTAUTH_SECRET is not defined");
        return next(new Error("Internal server error"));
      }

      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET) as Record<string, unknown>;
      socket.data.userId = (decoded.id ?? decoded.sub) as string;
      socket.data.userRole = decoded.role as string;
      next();
    } catch (error) {
      logger.error({ err: error }, "Socket authentication error");
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    logger.info(`User connected: ${userId} (socket ID: ${socket.id})`);

    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("disconnect", (reason) => {
      logger.info(`User disconnected: ${userId} (socket ID: ${socket.id}), reason: ${reason}`);
    });

    socket.on("error", (err) => {
      logger.error({ err }, `Socket error for user ${userId}`);
    });
  });

  setIO(io);
}
