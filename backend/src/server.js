require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");

const port = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await connectDB();
    console.log("SQL Server connected");
  } catch (error) {
    console.error("SQL Server connection failed:", error.message);
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer();
