import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { decode } from "next-auth/jwt";

// ─── Fail-fast env validation ─────────────────────────────────────────────────
const REQUIRED_ENV_VARS = [
  "NEXTAUTH_SECRET",
  "APP_ORIGIN",
  "SOCKET_RELAY_SECRET",
] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(
      `[sockets] FATAL: required environment variable "${key}" is not set.`,
    );
    process.exit(1);
  }
}

const app = express();
app.use(express.json());

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.APP_ORIGIN,
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ─── JWT authentication (same logic as my-app/src/socket/index.ts) ────────────
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token || typeof token !== "string") {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decoded) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.data.userId = (decoded.id ?? decoded.sub) as string;
    socket.data.userRole = decoded.role as string;
    next();
  } catch (err) {
    console.error("[sockets] auth error", err);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log(`[sockets] connected: ${userId} (${socket.id})`);

  if (userId) {
    socket.join(`user:${userId}`);
  }

  socket.on("disconnect", (reason) => {
    console.log(
      `[sockets] disconnected: ${userId} (${socket.id}), reason: ${reason}`,
    );
  });
});

// ─── Internal relay endpoint ──────────────────────────────────────────────────
// Called by the Vercel app's server-side code to push real-time events.
app.post("/emit", (req, res) => {
  if (req.headers["x-internal-secret"] !== process.env.SOCKET_RELAY_SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const { event, room, payload } = req.body ?? {};
  if (!event || !room) {
    return res.status(400).json({ error: "event and room are required" });
  }

  io.to(room).emit(event, payload);
  res.status(200).json({ ok: true });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => res.status(200).send("ok"));

const port = parseInt(process.env.PORT ?? "4000", 10);
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`[sockets] listening on ${port}`);
});
