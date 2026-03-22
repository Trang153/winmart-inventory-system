const authService = require("../services/auth.service");

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    const result = await authService.login({ username, password });

    return res.json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}

module.exports = {
  login,
};
