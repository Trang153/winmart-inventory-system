const express = require("express");
const productController = require("../controllers/product.controller");
const { requireRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", requireRoles(["Admin"]), productController.createProduct);
router.patch("/:id/stock", requireRoles(["Admin"]), productController.adjustProductStock);
router.put("/:id", requireRoles(["Admin"]), productController.updateProduct);
router.delete("/:id", requireRoles(["Admin"]), productController.deleteProduct);

module.exports = router;
