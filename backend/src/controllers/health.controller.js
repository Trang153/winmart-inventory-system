const healthService = require("../services/health.service");

function getHealth(_req, res) {
  res.json(healthService.getHealthStatus());
}

async function getDatabaseHealth(_req, res) {
  try {
    const result = await healthService.getDatabaseTime();

    res.json({
      success: true,
      message: "Connected to SQL Server successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
}

module.exports = {
  getHealth,
  getDatabaseHealth,
};
