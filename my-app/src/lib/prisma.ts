/**
 * Prisma client — standard Node.js TCP connection (no serverless adapter).
 *
 * Why no @prisma/adapter-neon / WebSocket adapter:
 *   • That adapter is for edge runtimes (Vercel Edge, Cloudflare Workers)
 *     where native TCP is unavailable.  This app runs on plain Node.js, so
 *     standard Prisma with TCP is correct, simpler, and faster.
 *   • The WebSocket adapter also had an env-loading race: the Pool was being
 *     constructed before DATABASE_URL was available in the bundled Next.js
 *     worker context, causing silent fallback to localhost defaults.
 *
 * DATABASE_URL must be the Neon *direct* (non-pooled) connection string for
 * Node.js.  The pooler URL (contains "-pooler") uses PgBouncer which works
 * but is unnecessary overhead for a server-side Node.js process.
 * The DIRECT_URL is used by `prisma migrate` commands only.
 */

import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { _prisma?: PrismaClient };

function buildClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// In development, reuse the client across hot-reloads to avoid exhausting
// the Neon connection limit.  In production, create once per process.
export const prisma: PrismaClient =
  g._prisma ??
  (() => {
    const client = buildClient();
    if (process.env.NODE_ENV !== "production") {
      g._prisma = client;
    }
    return client;
  })();
