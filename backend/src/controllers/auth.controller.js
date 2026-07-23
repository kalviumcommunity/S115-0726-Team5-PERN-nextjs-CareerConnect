const bcrypt = require("bcryptjs");
const { query, withTransaction } = require("../config/db");
const { signToken } = require("../utils/jwt");
const { toUserJSON } = require("../utils/mappers");
const { getInitials } = require("../utils/format");
const HttpError = require("../utils/HttpError");

const ALLOWED_ROLES = ["candidate", "employer"];

/**
 * POST /api/auth/register
 * body: { name, email, password, role, companyName? }
 * Creates the user plus the companion profile row (candidate_profiles or
 * companies) so every other endpoint has a row to read/update immediately.
 */
const register = async (req, res) => {
  const { name, email, password, role, companyName } = req.body;

  if (!name || !email || !password || !role) {
    throw new HttpError(400, "name, email, password and role are required.");
  }
  if (!ALLOWED_ROLES.includes(role)) {
    throw new HttpError(400, `role must be one of: ${ALLOWED_ROLES.join(", ")}`);
  }
  if (password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters.");
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw new HttpError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await withTransaction(async (client) => {
    const userRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email.toLowerCase(), passwordHash, role]
    );
    const newUser = userRes.rows[0];

    if (role === "candidate") {
      await client.query(
        `INSERT INTO candidate_profiles (user_id, avatar) VALUES ($1, $2)`,
        [newUser.id, getInitials(name)]
      );
    } else {
      await client.query(
        `INSERT INTO companies (employer_id, name, logo_initials)
         VALUES ($1, $2, $3)`,
        [newUser.id, companyName || `${name}'s Company`, getInitials(companyName || name)]
      );
    }

    return newUser;
  });

  const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
  res.status(201).json({ token, user: toUserJSON(user) });
};

/**
 * POST /api/auth/login
 * body: { email, password }
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new HttpError(400, "email and password are required.");
  }

  const result = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
  const user = result.rows[0];
  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = signToken({ id: user.id, role: user.role, name: user.name, email: user.email });
  res.json({ token, user: toUserJSON(user) });
};

/**
 * GET /api/auth/me (protected)
 */
const me = async (req, res) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
  const user = result.rows[0];
  if (!user) throw new HttpError(404, "User not found.");
  res.json({ user: toUserJSON(user) });
};

module.exports = { register, login, me };
