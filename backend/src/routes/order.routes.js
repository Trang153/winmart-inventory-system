const express = require("express");
const orderController = require("../controllers/order.controller");
const { requireRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", orderController.getAllOrders);
router.get("/next-code", orderController.getNextOrderCode);
router.get("/discount-codes", orderController.getDiscountCodes);
router.get("/report", orderController.getOrderReport);
router.get("/dashboard-summary", orderController.getDashboardSummary);
router.get("/customers", orderController.searchCustomers);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.delete("/:id", requireRoles(["Admin"]), orderController.deleteOrder);
router.patch("/:id/status", requireRoles(["Staff", "Manager", "Admin"]), orderController.updateOrderStatus);

module.exports = router;
