// Normalizes thrown errors (including Postgres errors) into a consistent
// JSON response shape: { message, ...details }.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("[error]", err);

  // Postgres unique_violation (e.g. duplicate email, duplicate application)
  if (err.code === "23505") {
    return res.status(409).json({ message: "This record already exists." });
  }

  // Postgres foreign_key_violation / not-null violation etc.
  if (err.code && err.code.startsWith("23")) {
    return res.status(400).json({ message: "Invalid data provided." });
  }

  const status = err.status || 500;
  const message = err.message || "Internal server error.";
  res.status(status).json({ message });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFoundHandler };
