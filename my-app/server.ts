// ─── Load .env FIRST ─────────────────────────────────────────────────────────
// This MUST be the first executable statement in the file.  TypeScript/tsx
// evaluates all top-level `import` declarations before any `import()`/require,
// but with `dotenv` imported as a normal ESM import its side effect (.config())
// would only fire after all static imports are resolved — which means every
// other module in this file would already have been evaluated with an empty
// process.env.  Using a dynamic require here guarantees dotenv runs before any
// other module's top-level code can read process.env.
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();

// ─── Now it is safe to import modules that read process.env ──────────────────
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initSocketServer } from "@/socket";
import { logger } from "@/lib/logger";

// ─── Fail-fast env validation ─────────────────────────────────────────────────
const REQUIRED_ENV_VARS = ["DATABASE_URL", "DIRECT_URL", "NEXTAUTH_SECRET"] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(
      `[server] FATAL: required environment variable "${key}" is not set. ` +
        "Copy .env.example to .env and fill in the values before starting.",
    );
    process.exit(1);
  }
}

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
