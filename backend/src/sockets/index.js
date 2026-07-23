const { Server } = require("socket.io");
const { verifyToken } = require("../utils/jwt");
const env = require("../config/env");

let io = null;

/**
 * Every connected client joins a private room named `user:<id>`.
 * This lets the API push events to exactly the candidate or employer
 * who needs to see them, without broadcasting to everyone.
 *
 * Events emitted by this app:
 *   - "application:new"      -> to the employer who owns the job, the instant
 *                                a candidate applies (appears immediately, Pending)
 *   - "application:statusUpdate" -> to the candidate whose application changed
 *                                (single update OR as part of a batch update),
 *                                so "viewed"/"rejected"/etc. reflect in real time
 *   - "notification:new"     -> to whichever user (candidate or employer) a new
 *                                notification was created for
 */
function initSockets(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
  });

  // Authenticate the socket using the same JWT issued by /api/auth/login
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        (socket.handshake.headers.authorization || "").split(" ")[1];

      if (!token) return next(new Error("Authentication required"));

      const payload = verifyToken(token);
      socket.user = payload; // { id, role, name, email }
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const room = `user:${socket.user.id}`;
    socket.join(room);
    console.log(`[socket] ${socket.user.role} ${socket.user.id} connected -> joined ${room}`);

    socket.on("disconnect", () => {
      console.log(`[socket] ${socket.user.id} disconnected`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized yet. Call initSockets(httpServer) first.");
  }
  return io;
}

/** Push an event to a single user's private room (safe no-op if sockets aren't up yet). */
function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}

module.exports = { initSockets, getIO, emitToUser };
