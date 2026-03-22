const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const supplierRoutes = require("./supplier.routes");
const productRoutes = require("./product.routes");
const uploadRoutes = require("./upload.routes");

const router = express.Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/products", productRoutes);
router.use("/uploads", uploadRoutes);

module.exports = router;
