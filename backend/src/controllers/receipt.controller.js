const receiptService = require("../services/receipt.service");

async function getReceiptRequests(_req, res) {
  try {
    const requests = await receiptService.getReceiptRequests();

    return res.json({
      success: true,
      message: "Receipt requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch receipt requests",
      error: error.message,
    });
  }
}

async function createReceiptRequest(req, res) {
  try {
    const request = await receiptService.createReceiptRequest(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Receipt request created successfully",
      data: request,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create receipt request",
    });
  }
}

async function reviewReceiptRequest(req, res) {
  try {
    const request = await receiptService.reviewReceiptRequest(req.params.id, req.body, req.user);

    return res.json({
      success: true,
      message: "Receipt request reviewed successfully",
      data: request,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to review receipt request",
    });
  }
}

async function hideReceiptRequest(req, res) {
  try {
    const request = await receiptService.hideReceiptRequest(req.params.id);

    return res.json({
      success: true,
      message: "Receipt request hidden successfully",
      data: request,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to hide receipt request",
    });
  }
}

module.exports = {
  getReceiptRequests,
  createReceiptRequest,
  reviewReceiptRequest,
  hideReceiptRequest,
};
