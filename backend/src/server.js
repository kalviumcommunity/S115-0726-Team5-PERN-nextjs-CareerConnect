const http = require("http");
const app = require("./app");
const env = require("./config/env");
const { initSockets } = require("./sockets");
const { pool } = require("./config/db");

const server = http.createServer(app);

// Attach Socket.io to the same HTTP server so real-time application/
// notification events share the port with the REST API.
initSockets(server);

server.listen(env.port, async () => {
  console.log(`[server] Career Connect API listening on port ${env.port} (${env.nodeEnv})`);
  console.log(`[server] CORS allowed origin: ${env.corsOrigin}`);

  try {
    await pool.query("SELECT 1");
    console.log("[server] PostgreSQL connection OK");
  } catch (err) {
    console.error("[server] WARNING: could not connect to PostgreSQL:", err.message);
    console.error("[server] Did you run `npm run migrate` and check your .env?");
  }
});

process.on("SIGTERM", () => {
  console.log("[server] SIGTERM received, shutting down...");
  server.close(() => process.exit(0));
});
