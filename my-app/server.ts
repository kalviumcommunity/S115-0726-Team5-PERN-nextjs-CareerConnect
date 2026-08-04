import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initSocketServer } from "@/socket";
import { logger } from "@/lib/logger";
import dotenv from "dotenv";

dotenv.config();
// ─── Fail-fast env validation ─────────────────────────────────────────────────
// These must be present before anything else starts. A missing value here
// would cause confusing downstream failures (Prisma connect errors, JWT
// failures, etc.) — surface it immediately at boot instead.
const REQUIRED_ENV_VARS = ["DATABASE_URL", "DIRECT_URL", "NEXTAUTH_SECRET"] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    // Use console.error here because the logger itself may not be fully
    // initialised, and we want this to always surface regardless of LOG_LEVEL.
    console.error(
      `[server] FATAL: required environment variable "${key}" is not set. ` +
        "Copy .env.example to .env and fill in the values before starting.",
    );
    process.exit(1);
  }
}
// console.log(process.env.DATABASE_URL);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url ?? "", true);
      await handle(req, res, parsedUrl);
    } catch (error) {
      logger.error({ err: error }, "Error handling request");
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  initSocketServer(server);

  server.listen(port, hostname, () => {
    logger.info(
      { hostname, port, env: process.env.NODE_ENV },
      "Server ready",
    );
  });
});
