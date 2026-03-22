const supplierService = require("../services/supplier.service");

async function getAllSuppliers(_req, res) {
  try {
    const suppliers = await supplierService.getAllSuppliers();

    return res.json({
      success: true,
      message: "Suppliers fetched successfully",
      data: suppliers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers",
      error: error.message,
    });
  }
}

async function getSupplierById(req, res) {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.json({
      success: true,
      message: "Supplier fetched successfully",
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch supplier",
      error: error.message,
    });
  }
}

async function createSupplier(req, res) {
  const { supplier_name, category, contact_info, image_url, total_order_value } = req.body;

  if (!supplier_name) {
    return res.status(400).json({
      success: false,
      message: "supplier_name is required",
    });
  }

  try {
    const supplier = await supplierService.createSupplier({
      supplier_name,
      category,
      contact_info,
      image_url,
      total_order_value,
    });

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create supplier",
    });
  }
}

async function updateSupplier(req, res) {
  const { supplier_name, category, contact_info, image_url, total_order_value } = req.body;

  if (!supplier_name) {
    return res.status(400).json({
      success: false,
      message: "supplier_name is required",
    });
  }

  try {
    const supplier = await supplierService.updateSupplier(req.params.id, {
      supplier_name,
      category,
      contact_info,
      image_url,
      total_order_value,
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update supplier",
    });
  }
}

async function deleteSupplier(req, res) {
  try {
    const deleted = await supplierService.deleteSupplier(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete supplier",
    });
  }
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
