const express = require("express");
const supplierController = require("../controllers/supplier.controller");
const { requireRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.post("/", requireRoles(["Admin"]), supplierController.createSupplier);
router.put("/:id", requireRoles(["Admin"]), supplierController.updateSupplier);
router.delete("/:id", requireRoles(["Admin"]), supplierController.deleteSupplier);

module.exports = router;
