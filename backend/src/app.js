const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

module.exports = app;
