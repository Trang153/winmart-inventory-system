const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "winmart_jwt_secret_key";

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

function requireRoles(allowedRoles = []) {
  const normalizedRoles = allowedRoles.map((role) => String(role).toLowerCase());

  return (req, res, next) => {
    const roleName = String(req.user?.roleName || "").toLowerCase();

    if (!normalizedRoles.includes(roleName)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    return next();
  };
}

module.exports = {
  authenticate,
  requireRoles,
};
