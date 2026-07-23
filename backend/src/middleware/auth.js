const { verifyToken } = require("../utils/jwt");

/**
 * Requires a valid `Authorization: Bearer <token>` header.
 * Populates req.user = { id, role, name, email }.
 */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or malformed Authorization header." });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload; // { id, role, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

/**
 * Restricts a route to one or more roles. Use after requireAuth.
 * e.g. router.post('/jobs', requireAuth, requireRole('employer'), ...)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: `This action requires role: ${roles.join(" or ")}.` });
  }
  next();
};

/**
 * Like requireAuth, but never rejects the request. If a valid token is
 * present, req.user is populated; otherwise the route proceeds as a guest.
 * Used on GET /api/jobs so it stays public but can still compute
 * per-candidate `applied` flags when a token is supplied.
 */
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme === "Bearer" && token) {
    try {
      req.user = verifyToken(token);
    } catch (err) {
      // ignore invalid token — treat as guest
    }
  }
  next();
};

module.exports = { requireAuth, requireRole, optionalAuth };
