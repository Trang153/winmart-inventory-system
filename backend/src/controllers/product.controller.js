const productService = require("../services/product.service");

async function getAllProducts(_req, res) {
  try {
    const products = await productService.getAllProducts();

    return res.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
}

async function createProduct(req, res) {
  const { product_name, category, supplier_id, price, price_stock, image_url } = req.body;

  if (!product_name || !supplier_id || price === undefined) {
    return res.status(400).json({
      success: false,
      message: "product_name, supplier_id and price are required",
    });
  }

  try {
    const product = await productService.createProduct({
      product_name,
      category,
      supplier_id,
      price,
      price_stock,
      image_url,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
}

async function updateProduct(req, res) {
  const { product_name, category, supplier_id, price, price_stock, image_url } = req.body;

  if (!product_name || !supplier_id || price === undefined) {
    return res.status(400).json({
      success: false,
      message: "product_name, supplier_id and price are required",
    });
  }

  try {
    const product = await productService.updateProduct(req.params.id, {
      product_name,
      category,
      supplier_id,
      price,
      price_stock,
      image_url,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const deleted = await productService.deleteProduct(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
