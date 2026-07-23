const { Pool } = require("pg");
const env = require("./env");

// Prefer a single DATABASE_URL (common on Render/Railway/Heroku-style hosts),
// fall back to discrete PG* vars for local development.
const pool = env.databaseUrl
  ? new Pool({
      connectionString: env.databaseUrl,
      ssl: env.nodeEnv === "production" ? { rejectUnauthorized: false } : false,
    })
  : new Pool(env.pg);

pool.on("error", (err) => {
  // Unexpected errors on idle clients — log and let the process manager restart if needed.
  console.error("[postgres] unexpected error on idle client", err);
});

const query = (text, params) => pool.query(text, params);

/**
 * Run a set of queries inside a single transaction.
 * `fn` receives a connected client and must use it for every query.
 */
const withTransaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { pool, query, withTransaction };
