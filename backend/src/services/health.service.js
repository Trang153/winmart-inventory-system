const { query } = require("../config/db");

function getHealthStatus() {
  return {
    success: true,
    message: "Backend is running",
  };
}

async function getDatabaseTime() {
  const result = await query("SELECT GETDATE() AS currentTime");
  return result.recordset[0];
}

module.exports = {
  getHealthStatus,
  getDatabaseTime,
};
