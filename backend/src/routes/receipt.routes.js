const express = require("express");
const receiptController = require("../controllers/receipt.controller");
const { requireRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", requireRoles(["Admin"]), receiptController.getReceiptRequests);
router.post("/", requireRoles(["Staff", "Manager", "Admin"]), receiptController.createReceiptRequest);
router.patch("/:id/review", requireRoles(["Admin"]), receiptController.reviewReceiptRequest);
router.patch("/:id/hide", requireRoles(["Admin"]), receiptController.hideReceiptRequest);

module.exports = router;
