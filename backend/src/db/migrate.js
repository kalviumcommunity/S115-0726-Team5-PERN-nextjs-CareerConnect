/**
 * Applies schema.sql to the configured PostgreSQL database.
 * Usage: npm run migrate
 */
const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

async function migrate() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  console.log("[migrate] connecting to database...");
  const client = await pool.connect();
  try {
    console.log("[migrate] applying schema.sql...");
    await client.query(sql);
    console.log("[migrate] done. Tables are ready.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("[migrate] failed:", err.message);
  process.exit(1);
});
