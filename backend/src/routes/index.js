const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const supplierRoutes = require("./supplier.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const receiptRoutes = require("./receipt.routes");
const uploadRoutes = require("./upload.routes");
const userRoutes = require("./user.routes");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use(authenticate);
router.use("/suppliers", supplierRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/receipts", receiptRoutes);
router.use("/uploads", uploadRoutes);
router.use("/users", userRoutes);

module.exports = router;
