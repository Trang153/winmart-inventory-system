const orderService = require("../services/order.service");

async function getAllOrders(_req, res) {
  try {
    const orders = await orderService.getAllOrders();

    return res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
}

async function getNextOrderCode(_req, res) {
  try {
    const orderCode = await orderService.getNextOrderCode();

    return res.json({
      success: true,
      message: "Next order code fetched successfully",
      data: { order_code: orderCode },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch next order code",
      error: error.message,
    });
  }
}

async function getDiscountCodes(_req, res) {
  try {
    const discountCodes = await orderService.getDiscountCodes();

    return res.json({
      success: true,
      message: "Discount codes fetched successfully",
      data: discountCodes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch discount codes",
      error: error.message,
    });
  }
}

async function getOrderReport(req, res) {
  try {
    const report = await orderService.getOrderReport(req.user);

    return res.json({
      success: true,
      message: "Order report fetched successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order report",
      error: error.message,
    });
  }
}

async function exportOrderReport(req, res) {
  try {
    const exportedReport = await orderService.exportOrderReport(req.user, req.query.format);

    res.setHeader("Content-Type", exportedReport.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${exportedReport.filename}"`);

    return res.send(exportedReport.buffer);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export order report",
      error: error.message,
    });
  }
}

async function getDashboardSummary(_req, res) {
  try {
    const summary = await orderService.getDashboardSummary();

    return res.json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
}

async function searchCustomers(req, res) {
  try {
    const customers = await orderService.searchCustomers(req.query.search || "");

    return res.json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
}

async function createOrder(req, res) {
  try {
    const order = await orderService.createOrder(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
}

async function deleteOrder(req, res) {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete order",
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  getNextOrderCode,
  getDiscountCodes,
  getOrderReport,
  exportOrderReport,
  getDashboardSummary,
  searchCustomers,
  createOrder,
  deleteOrder,
  updateOrderStatus,
};
