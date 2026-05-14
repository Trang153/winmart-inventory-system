const { query } = require("../config/db");

function normalizeReceiptRequest(record) {
  return {
    receipt_request_id: record.receipt_request_id,
    order_id: record.order_id,
    order_code: record.order_code,
    supplier_id: record.supplier_id,
    supplier_name: record.supplier_name,
    received_quantity: Number(record.received_quantity || 0),
    invoice_image_url: record.invoice_image_url,
    status: record.status,
    is_hidden: Boolean(record.is_hidden),
    requested_by: record.requested_by,
    requested_by_username: record.requested_by_username,
    requested_at: record.requested_at,
    reviewed_by: record.reviewed_by,
    reviewed_by_username: record.reviewed_by_username,
    reviewed_at: record.reviewed_at,
    review_note: record.review_note,
  };
}

async function ensureReceiptHiddenColumn() {
  await query(`
    IF COL_LENGTH('dbo.ReceiptRequests', 'is_hidden') IS NULL
    BEGIN
      ALTER TABLE dbo.ReceiptRequests
      ADD is_hidden BIT NOT NULL CONSTRAINT DF_ReceiptRequests_is_hidden DEFAULT (0)
    END
  `);
}

async function ensurePurchaseOrder(orderId) {
  const result = await query(
    `
      SELECT order_id, order_type
      FROM dbo.Orders
      WHERE order_id = @order_id
    `,
    { order_id: Number(orderId) }
  );

  const order = result.recordset[0];

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (!String(order.order_type || "").toLowerCase().includes("purchase")) {
    const error = new Error("Receipt requests can only be created for purchase orders");
    error.statusCode = 400;
    throw error;
  }

  return order;
}

async function getReceiptRequests() {
  await ensureReceiptHiddenColumn();

  const result = await query(`
    SELECT
      rr.receipt_request_id,
      rr.order_id,
      o.order_code,
      o.supplier_id,
      s.supplier_name,
      rr.received_quantity,
      rr.invoice_image_url,
      rr.status,
      rr.is_hidden,
      rr.requested_by,
      requester.username AS requested_by_username,
      rr.requested_at,
      rr.reviewed_by,
      reviewer.username AS reviewed_by_username,
      rr.reviewed_at,
      rr.review_note
    FROM dbo.ReceiptRequests rr
    INNER JOIN dbo.Orders o ON o.order_id = rr.order_id
    INNER JOIN dbo.Suppliers s ON s.supplier_id = o.supplier_id
    INNER JOIN dbo.Users requester ON requester.user_id = rr.requested_by
    LEFT JOIN dbo.Users reviewer ON reviewer.user_id = rr.reviewed_by
    ORDER BY
      CASE rr.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
      rr.requested_at DESC,
      rr.receipt_request_id DESC
  `);

  return result.recordset.map(normalizeReceiptRequest);
}

async function createReceiptRequest(data, user) {
  await ensureReceiptHiddenColumn();

  const orderId = Number(data.order_id);
  const receivedQuantity = Number(data.received_quantity);
  const requestedBy = Number(user?.userId);

  if (!orderId) {
    const error = new Error("order_id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isFinite(receivedQuantity) || receivedQuantity <= 0) {
    const error = new Error("received_quantity must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  if (!requestedBy) {
    const error = new Error("requested_by is required");
    error.statusCode = 400;
    throw error;
  }

  await ensurePurchaseOrder(orderId);

  const result = await query(
    `
      INSERT INTO dbo.ReceiptRequests (
        order_id,
        received_quantity,
        invoice_image_url,
        requested_by
      )
      OUTPUT inserted.receipt_request_id
      VALUES (
        @order_id,
        @received_quantity,
        @invoice_image_url,
        @requested_by
      )
    `,
    {
      order_id: orderId,
      received_quantity: receivedQuantity,
      invoice_image_url: data.invoice_image_url || null,
      requested_by: requestedBy,
    }
  );

  const receiptRequestId = result.recordset[0].receipt_request_id;

  await query(
    `
      UPDATE dbo.Orders
      SET order_status = N'Approved'
      WHERE order_id = @order_id
        AND order_status = N'Pending'
    `,
    { order_id: orderId }
  );

  const requests = await getReceiptRequests();

  return requests.find((request) => request.receipt_request_id === receiptRequestId);
}

async function reviewReceiptRequest(id, data, user) {
  await ensureReceiptHiddenColumn();

  const receiptRequestId = Number(id);
  const status = String(data.status || "").toLowerCase();
  const reviewedBy = Number(user?.userId);

  if (!["approved", "rejected"].includes(status)) {
    const error = new Error("status must be approved or rejected");
    error.statusCode = 400;
    throw error;
  }

  const existingResult = await query(
    `
      SELECT receipt_request_id, status
      FROM dbo.ReceiptRequests
      WHERE receipt_request_id = @receipt_request_id
    `,
    { receipt_request_id: receiptRequestId }
  );

  const existing = existingResult.recordset[0];

  if (!existing) {
    const error = new Error("Receipt request not found");
    error.statusCode = 404;
    throw error;
  }

  if (existing.status !== "pending") {
    const error = new Error("Only pending receipt requests can be reviewed");
    error.statusCode = 409;
    throw error;
  }

  await query(
    `
      UPDATE dbo.ReceiptRequests
      SET
        status = @status,
        reviewed_by = @reviewed_by,
        reviewed_at = SYSUTCDATETIME(),
        review_note = @review_note
      WHERE receipt_request_id = @receipt_request_id
    `,
    {
      receipt_request_id: receiptRequestId,
      status,
      reviewed_by: reviewedBy,
      review_note: data.review_note || null,
    }
  );

  const requests = await getReceiptRequests();

  return requests.find((request) => request.receipt_request_id === receiptRequestId);
}

async function hideReceiptRequest(id) {
  await ensureReceiptHiddenColumn();

  const receiptRequestId = Number(id);

  if (!receiptRequestId) {
    const error = new Error("receipt_request_id is required");
    error.statusCode = 400;
    throw error;
  }

  const existingResult = await query(
    `
      SELECT receipt_request_id
      FROM dbo.ReceiptRequests
      WHERE receipt_request_id = @receipt_request_id
    `,
    { receipt_request_id: receiptRequestId }
  );

  if (!existingResult.recordset.length) {
    const error = new Error("Receipt request not found");
    error.statusCode = 404;
    throw error;
  }

  await query(
    `
      UPDATE dbo.ReceiptRequests
      SET is_hidden = 1
      WHERE receipt_request_id = @receipt_request_id
    `,
    { receipt_request_id: receiptRequestId }
  );

  const requests = await getReceiptRequests();

  return requests.find((request) => request.receipt_request_id === receiptRequestId);
}

module.exports = {
  getReceiptRequests,
  createReceiptRequest,
  reviewReceiptRequest,
  hideReceiptRequest,
};
