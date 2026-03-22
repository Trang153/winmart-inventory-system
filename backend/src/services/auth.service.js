const jwt = require("jsonwebtoken");
const { query } = require("../config/db");

const jwtSecret = process.env.JWT_SECRET || "winmart_jwt_secret_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

async function findUserByUsername(username) {
  const result = await query(
    `
      SELECT
        u.user_id,
        u.username,
        u.password,
        u.role_id,
        u.store_id,
        r.role_name
      FROM dbo.Users u
      INNER JOIN dbo.Roles r ON r.role_id = u.role_id
      WHERE u.username = @username
    `,
    { username }
  );

  return result.recordset[0];
}

async function login({ username, password }) {
  const user = await findUserByUsername(username);

  if (!user || user.password !== password) {
    const error = new Error("Invalid username or password");
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    userId: user.user_id,
    username: user.username,
    roleId: user.role_id,
    roleName: user.role_name,
    storeId: user.store_id,
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

  return {
    token,
    user: payload,
  };
}

module.exports = {
  login,
};
