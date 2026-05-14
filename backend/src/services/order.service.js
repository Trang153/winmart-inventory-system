const { query } = require("../config/db");

function normalizeOrder(record) {
  return {
    order_id: record.order_id,
    order_code: record.order_code,
    order_type: record.order_type || "Purchase Order",
    supplier_id: record.supplier_id,
    supplier_name: record.supplier_name,
    customer_id: record.customer_id,
    created_by: record.created_by,
    created_by_username: record.created_by_username,
    order_date: record.order_date,
    expected_delivery_date: record.expected_delivery_date,
    total_amount: Number(record.total_amount || 0),
    order_status: record.order_status,
    payment_method: record.payment_method || "Bank Transfer",
    payment_status: record.payment_status || "Unpaid",
    discount_amount: Number(record.discount_amount || 0),
    discount_code: record.discount_code,
    tax_rate: Number(record.tax_rate || 0),
    shipping_address: record.shipping_address,
    notes: record.notes,
    customer_name: record.customer_name,
    customer_phone: record.customer_phone,
    points_redeemed: Number(record.points_redeemed || 0),
    points_discount: Number(record.points_discount || 0),
    points_earned: Number(record.points_earned || 0),
    item_count: Number(record.item_count || 0),
  };
}

function normalizeOrderItem(record) {
  return {
    order_item_id: record.order_item_id,
    order_id: record.order_id,
    product_id: record.product_id,
    product_name: record.product_name,
    category: record.category,
    image_url: record.image_url,
    quantity: Number(record.quantity || 0),
    unit_price: Number(record.unit_price || 0),
    line_total: Number(record.line_total || 0),
  };
}

async function getAllOrders() {
  const result = await query(`
    SELECT
      o.order_id,
      o.order_code,
      o.order_type,
      o.supplier_id,
      s.supplier_name,
      o.customer_id,
      o.created_by,
      u.username AS created_by_username,
      o.order_date,
      o.expected_delivery_date,
      o.total_amount,
      o.order_status,
      o.payment_method,
      o.payment_status,
      o.discount_amount,
      o.discount_code,
      o.tax_rate,
      o.shipping_address,
      o.notes,
      o.customer_name,
      o.customer_phone,
      o.points_redeemed,
      o.points_discount,
      o.points_earned,
      COUNT(oi.order_item_id) AS item_count
    FROM dbo.Orders o
    INNER JOIN dbo.Suppliers s ON s.supplier_id = o.supplier_id
    INNER JOIN dbo.Users u ON u.user_id = o.created_by
    LEFT JOIN dbo.OrderItems oi ON oi.order_id = o.order_id
    GROUP BY
      o.order_id,
      o.order_code,
      o.order_type,
      o.supplier_id,
      s.supplier_name,
      o.customer_id,
      o.created_by,
      u.username,
      o.order_date,
      o.expected_delivery_date,
      o.total_amount,
      o.order_status,
      o.payment_method,
      o.payment_status,
      o.discount_amount,
      o.discount_code,
      o.tax_rate,
      o.shipping_address,
      o.notes,
      o.customer_name,
      o.customer_phone,
      o.points_redeemed,
      o.points_discount,
      o.points_earned
    ORDER BY o.order_date DESC, o.order_id DESC
  `);

  return result.recordset.map(normalizeOrder);
}

async function getOrderById(id) {
  const orderResult = await query(
    `
      SELECT
        o.order_id,
        o.order_code,
        o.order_type,
        o.supplier_id,
        s.supplier_name,
        o.customer_id,
        o.created_by,
        u.username AS created_by_username,
        o.order_date,
        o.expected_delivery_date,
        o.total_amount,
        o.order_status,
        o.payment_method,
        o.payment_status,
        o.discount_amount,
        o.discount_code,
        o.tax_rate,
        o.shipping_address,
        o.notes,
        o.customer_name,
        o.customer_phone,
        o.points_redeemed,
        o.points_discount,
        o.points_earned,
        COUNT(oi.order_item_id) AS item_count
      FROM dbo.Orders o
      INNER JOIN dbo.Suppliers s ON s.supplier_id = o.supplier_id
      INNER JOIN dbo.Users u ON u.user_id = o.created_by
      LEFT JOIN dbo.OrderItems oi ON oi.order_id = o.order_id
      WHERE o.order_id = @order_id
      GROUP BY
        o.order_id,
        o.order_code,
        o.order_type,
        o.supplier_id,
        s.supplier_name,
        o.customer_id,
        o.created_by,
        u.username,
        o.order_date,
        o.expected_delivery_date,
        o.total_amount,
        o.order_status,
        o.payment_method,
        o.payment_status,
        o.discount_amount,
        o.discount_code,
        o.tax_rate,
        o.shipping_address,
        o.notes,
        o.customer_name,
        o.customer_phone,
        o.points_redeemed,
        o.points_discount,
        o.points_earned
    `,
    { order_id: Number(id) }
  );

  const order = orderResult.recordset[0];

  if (!order) {
    return null;
  }

  const itemsResult = await query(
    `
      SELECT
        oi.order_item_id,
        oi.order_id,
        oi.product_id,
        p.product_name,
        p.category,
        p.image_url,
        oi.quantity,
        oi.unit_price,
        oi.line_total
      FROM dbo.OrderItems oi
      INNER JOIN dbo.Products p ON p.product_id = oi.product_id
      WHERE oi.order_id = @order_id
      ORDER BY oi.order_item_id ASC
    `,
    { order_id: Number(id) }
  );

  return {
    ...normalizeOrder(order),
    items: itemsResult.recordset.map(normalizeOrderItem),
  };
}

async function getNextOrderCode() {
  const result = await query(`
    SELECT ISNULL(MAX(order_id), 0) + 1 AS next_id
    FROM dbo.Orders
  `);

  return `ORD-${String(result.recordset[0].next_id).padStart(4, "0")}`;
}

async function getDiscountCodes() {
  const result = await query(`
    SELECT
      discount_code_id,
      code,
      description,
      discount_type,
      discount_value,
      is_active
    FROM dbo.DiscountCodes
    WHERE is_active = 1
    ORDER BY discount_code_id ASC
  `);

  return result.recordset.map((record) => ({
    discount_code_id: record.discount_code_id,
    code: record.code,
    description: record.description,
    discount_type: record.discount_type,
    discount_value: Number(record.discount_value || 0),
    is_active: Boolean(record.is_active),
  }));
}

async function getOrderReport(currentUser = null) {
  const roleName = String(currentUser?.roleName || "").toLowerCase();
  const isStaff = roleName === "staff";
  const reportParams = {
    user_id: Number(currentUser?.userId || 0),
    store_id: Number(currentUser?.storeId || 0),
  };
  const salesOrderCondition = `
    (o.order_type IS NULL OR o.order_type NOT LIKE '%Purchase%')
    AND o.order_status <> N'Cancelled'
    ${isStaff ? "AND o.created_by = @user_id" : ""}
  `;
  const inventoryStoreCondition = isStaff && reportParams.store_id
    ? "AND i.store_id = @store_id"
    : "";

  const summaryResult = await query(
    `
      SELECT
        ISNULL(SUM(CASE WHEN ${salesOrderCondition} THEN o.total_amount ELSE 0 END), 0) AS total_revenue,
        SUM(CASE WHEN ${salesOrderCondition} THEN 1 ELSE 0 END) AS total_orders
      FROM dbo.Orders o
    `,
    reportParams
  );
  const inventoryResult = await query(
    `
      SELECT
        ISNULL(SUM(p.price * ISNULL(inv.quantity, 0)), 0) AS inventory_value,
        SUM(CASE WHEN ISNULL(inv.quantity, 0) <= 20 THEN 1 ELSE 0 END) AS low_stock_count
      FROM dbo.Products p
      OUTER APPLY (
        SELECT SUM(quantity) AS quantity
        FROM dbo.Inventory i
        WHERE i.product_id = p.product_id
          ${inventoryStoreCondition}
      ) inv
    `,
    reportParams
  );
  const monthlyResult = await query(
    `
      SELECT
        MONTH(o.order_date) AS month_number,
        ISNULL(SUM(o.total_amount), 0) AS revenue
      FROM dbo.Orders o
      WHERE YEAR(o.order_date) = YEAR(GETDATE())
        AND ${salesOrderCondition}
      GROUP BY MONTH(o.order_date)
    `,
    reportParams
  );
  const topProductsResult = await query(
    `
      SELECT TOP 5
        p.product_name,
        SUM(oi.quantity) AS sold,
        SUM(oi.line_total) AS revenue
      FROM dbo.OrderItems oi
      INNER JOIN dbo.Products p ON p.product_id = oi.product_id
      INNER JOIN dbo.Orders o ON o.order_id = oi.order_id
      WHERE ${salesOrderCondition}
      GROUP BY p.product_name
      ORDER BY SUM(oi.quantity) DESC, SUM(oi.line_total) DESC
    `,
    reportParams
  );
  const inventoryByCategoryResult = await query(
    `
      SELECT TOP 5
        ISNULL(p.category, N'Uncategorized') AS category,
        ISNULL(SUM(inv.quantity), 0) AS items,
        ISNULL(SUM(p.price * ISNULL(inv.quantity, 0)), 0) AS value
      FROM dbo.Products p
      OUTER APPLY (
        SELECT SUM(quantity) AS quantity
        FROM dbo.Inventory i
        WHERE i.product_id = p.product_id
          ${inventoryStoreCondition}
      ) inv
      GROUP BY p.category
      ORDER BY ISNULL(SUM(p.price * ISNULL(inv.quantity, 0)), 0) DESC
    `,
    reportParams
  );
  const salesReportResult = await query(
    `
      SELECT
        o.order_status,
        COUNT(*) AS orders,
        ISNULL(SUM(o.total_amount), 0) AS revenue
      FROM dbo.Orders o
      WHERE ${salesOrderCondition}
      GROUP BY o.order_status
      ORDER BY ISNULL(SUM(o.total_amount), 0) DESC
    `,
    reportParams
  );

  const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
    const record = monthlyResult.recordset.find((row) => Number(row.month_number) === index + 1);
    return Number(record?.revenue || 0);
  });

  return {
    summary: {
      total_revenue: Number(summaryResult.recordset[0]?.total_revenue || 0),
      total_orders: Number(summaryResult.recordset[0]?.total_orders || 0),
      inventory_value: Number(inventoryResult.recordset[0]?.inventory_value || 0),
      low_stock_count: Number(inventoryResult.recordset[0]?.low_stock_count || 0),
    },
    monthly_revenue: monthlyRevenue,
    top_products: topProductsResult.recordset.map((record) => ({
      name: record.product_name,
      sold: Number(record.sold || 0),
      revenue: Number(record.revenue || 0),
    })),
    inventory_by_category: inventoryByCategoryResult.recordset.map((record) => ({
      category: record.category,
      items: Number(record.items || 0),
      value: Number(record.value || 0),
      status: Number(record.items || 0) <= 20 ? "Low" : Number(record.items || 0) <= 50 ? "Monitor" : "Healthy",
    })),
    sales_report: salesReportResult.recordset.map((record) => ({
      channel: record.order_status,
      orders: Number(record.orders || 0),
      revenue: Number(record.revenue || 0),
      trend: "",
    })),
    scope: isStaff ? "staff" : "admin",
    updated_at: new Date().toISOString(),
  };
}

function formatVnd(value) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value || 0))} VND`;
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function buildReportRows(report) {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return [
    ["Report Scope", report.scope === "staff" ? "Staff Report" : "Admin Report"],
    ["Updated At", report.updated_at],
    [],
    ["Summary"],
    ["Metric", "Value"],
    ["Total Revenue", formatVnd(report.summary.total_revenue)],
    ["Total Orders", report.summary.total_orders],
    ["Inventory Value", formatVnd(report.summary.inventory_value)],
    ["Low Stock Alerts", report.summary.low_stock_count],
    [],
    ["Monthly Revenue"],
    ["Month", "Revenue"],
    ...monthLabels.map((month, index) => [month, formatVnd(report.monthly_revenue[index])]),
    [],
    ["Top Selling Products"],
    ["Product", "Sold", "Revenue"],
    ...report.top_products.map((item) => [item.name, item.sold, formatVnd(item.revenue)]),
    [],
    ["Inventory By Category"],
    ["Category", "Items", "Value", "Status"],
    ...report.inventory_by_category.map((item) => [item.category, item.items, formatVnd(item.value), item.status]),
    [],
    ["Sales By Status"],
    ["Status", "Orders", "Revenue"],
    ...report.sales_report.map((item) => [item.channel, item.orders, formatVnd(item.revenue)]),
  ];
}

function buildOrderReportCsv(report) {
  const rows = buildReportRows(report);
  return `\uFEFF${rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n")}\r\n`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildOrderReportExcel(report) {
  const rows = buildReportRows(report);
  const tableRows = rows.map((row) => {
    if (!row.length) {
      return "<tr><td colspan=\"4\"></td></tr>";
    }

    return `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`;
  });

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    table { border-collapse: collapse; font-family: Arial, sans-serif; }
    td { border: 1px solid #d9d9d9; padding: 6px 10px; }
  </style>
</head>
<body>
  <table>${tableRows.join("")}</table>
</body>
</html>`;
}

function toPdfText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/[\\()]/g, "\\$&");
}

function wrapPdfLine(line, maxLength = 92) {
  const words = String(line).split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : [""];
}

function buildOrderReportPdf(report) {
  const sourceLines = buildReportRows(report).flatMap((row) => {
    if (!row.length) {
      return [""];
    }

    if (row.length === 1) {
      return [`${row[0]}`];
    }

    return [row.join(" | ")];
  });
  const lines = sourceLines.flatMap((line) => wrapPdfLine(line));
  const linesPerPage = 42;
  const pages = [];

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage));
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];

  pages.forEach((pageLines) => {
    const content = [
      "BT",
      "/F1 10 Tf",
      "50 790 Td",
      "14 TL",
      ...pageLines.map((line, index) => `${index === 0 ? "" : "T* "}${`(${toPdfText(line)}) Tj`}`.trim()),
      "ET",
    ].join("\n");
    const contentId = addObject(`<< /Length ${Buffer.byteLength(content, "ascii")} >>\nstream\n${content}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((content, index) => {
    offsets.push(Buffer.byteLength(pdf, "ascii"));
    pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "ascii");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "ascii");
}

async function exportOrderReport(currentUser = null, format = "csv") {
  const normalizedFormat = String(format || "csv").toLowerCase();
  const report = await getOrderReport(currentUser);
  const scope = report.scope === "staff" ? "staff" : "admin";
  const timestamp = new Date().toISOString().slice(0, 10);

  if (normalizedFormat === "pdf") {
    return {
      buffer: buildOrderReportPdf(report),
      contentType: "application/pdf",
      filename: `${scope}-order-report-${timestamp}.pdf`,
    };
  }

  if (normalizedFormat === "excel" || normalizedFormat === "xls") {
    return {
      buffer: Buffer.from(buildOrderReportExcel(report), "utf8"),
      contentType: "application/vnd.ms-excel; charset=utf-8",
      filename: `${scope}-order-report-${timestamp}.xls`,
    };
  }

  return {
    buffer: Buffer.from(buildOrderReportCsv(report), "utf8"),
    contentType: "text/csv; charset=utf-8",
    filename: `${scope}-order-report-${timestamp}.csv`,
  };
}

async function getDashboardSummary() {
  const salesOrderCondition = `
    (o.order_type IS NULL OR o.order_type NOT LIKE '%Purchase%')
    AND o.order_status <> N'Cancelled'
  `;
  const todaySalesCondition = `
    o.order_date >= CAST(GETDATE() AS DATE)
    AND o.order_date < DATEADD(day, 1, CAST(GETDATE() AS DATE))
    AND ${salesOrderCondition}
  `;

  const summaryResult = await query(`
    SELECT
      ISNULL(SUM(CASE WHEN ${todaySalesCondition} THEN o.total_amount ELSE 0 END), 0) AS today_revenue,
      SUM(CASE WHEN ${todaySalesCondition} THEN 1 ELSE 0 END) AS today_orders
    FROM dbo.Orders o
  `);

  const adminSummaryResult = await query(`
    SELECT
      ISNULL(SUM(CASE WHEN ${salesOrderCondition} THEN o.total_amount ELSE 0 END), 0) AS total_revenue,
      SUM(CASE WHEN o.order_type LIKE '%Purchase%' AND o.order_status <> N'Cancelled' THEN 1 ELSE 0 END) AS purchase_orders,
      SUM(CASE WHEN ${salesOrderCondition} THEN 1 ELSE 0 END) AS sales_orders
    FROM dbo.Orders o
  `);

  const lowStockResult = await query(`
    SELECT
      SUM(CASE WHEN ISNULL(inv.inventory_quantity, 0) <= 20 THEN 1 ELSE 0 END) AS low_stock_count
    FROM dbo.Products p
    OUTER APPLY (
      SELECT SUM(i.quantity) AS inventory_quantity
      FROM dbo.Inventory i
      WHERE i.product_id = p.product_id
    ) inv
  `);

  const inventorySummaryResult = await query(`
    SELECT
      (SELECT COUNT(*) FROM dbo.Stores) AS warehouse_count,
      ISNULL(SUM(ISNULL(inv.quantity, 0)), 0) AS inventory_items
    FROM dbo.Products p
    OUTER APPLY (
      SELECT SUM(i.quantity) AS quantity
      FROM dbo.Inventory i
      WHERE i.product_id = p.product_id
    ) inv
  `);

  const productSummaryResult = await query(`
    SELECT COUNT(*) AS total_products
    FROM dbo.Products
  `);

  const lowStockProductsResult = await query(`
    SELECT TOP 5
      p.product_id,
      p.product_name,
      p.image_url,
      ISNULL(inv.inventory_quantity, 0) AS remaining_stock
    FROM dbo.Products p
    OUTER APPLY (
      SELECT SUM(i.quantity) AS inventory_quantity
      FROM dbo.Inventory i
      WHERE i.product_id = p.product_id
    ) inv
    WHERE ISNULL(inv.inventory_quantity, 0) <= 20
    ORDER BY ISNULL(inv.inventory_quantity, 0) ASC, p.product_name ASC
  `);

  const bestSellerResult = await query(`
    SELECT TOP 1
      p.product_id,
      p.product_name,
      p.category,
      p.image_url,
      SUM(oi.quantity) AS sold_quantity,
      SUM(oi.line_total) AS revenue
    FROM dbo.OrderItems oi
    INNER JOIN dbo.Orders o ON o.order_id = oi.order_id
    INNER JOIN dbo.Products p ON p.product_id = oi.product_id
    WHERE ${salesOrderCondition}
    GROUP BY p.product_id, p.product_name, p.category, p.image_url
    ORDER BY SUM(oi.quantity) DESC, SUM(oi.line_total) DESC
  `);

  const topProductsResult = await query(`
    SELECT TOP 5
      p.product_id,
      p.product_name,
      p.image_url,
      SUM(oi.quantity) AS sold_quantity,
      SUM(oi.line_total) AS revenue,
      ISNULL(inv.inventory_quantity, 0) AS remaining_stock
    FROM dbo.OrderItems oi
    INNER JOIN dbo.Orders o ON o.order_id = oi.order_id
    INNER JOIN dbo.Products p ON p.product_id = oi.product_id
    OUTER APPLY (
      SELECT SUM(i.quantity) AS inventory_quantity
      FROM dbo.Inventory i
      WHERE i.product_id = p.product_id
    ) inv
    WHERE ${salesOrderCondition}
    GROUP BY p.product_id, p.product_name, p.image_url, inv.inventory_quantity
    ORDER BY SUM(oi.quantity) DESC, SUM(oi.line_total) DESC
  `);

  const trendResult = await query(`
    SELECT
      YEAR(o.order_date) AS year_number,
      MONTH(o.order_date) AS month_number,
      ISNULL(SUM(CASE WHEN ${salesOrderCondition} THEN o.total_amount ELSE 0 END), 0) AS sales,
      ISNULL(SUM(CASE WHEN o.order_type LIKE '%Purchase%' AND o.order_status <> N'Cancelled' THEN o.total_amount ELSE 0 END), 0) AS purchase
    FROM dbo.Orders o
    WHERE o.order_date >= DATEADD(month, -4, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))
    GROUP BY YEAR(o.order_date), MONTH(o.order_date)
  `);

  const bestSeller = bestSellerResult.recordset[0];
  const now = new Date();
  const trend = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 4 + index, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const record = trendResult.recordset.find(
      (row) => Number(row.year_number) === year && Number(row.month_number) === month
    );

    return {
      label: date.toLocaleString("en-US", { month: "short" }),
      sales: Number(record?.sales || 0),
      purchase: Number(record?.purchase || 0),
    };
  });

  return {
    today_revenue: Number(summaryResult.recordset[0]?.today_revenue || 0),
    today_orders: Number(summaryResult.recordset[0]?.today_orders || 0),
    low_stock_count: Number(lowStockResult.recordset[0]?.low_stock_count || 0),
    total_revenue: Number(adminSummaryResult.recordset[0]?.total_revenue || 0),
    purchase_orders: Number(adminSummaryResult.recordset[0]?.purchase_orders || 0),
    sales_orders: Number(adminSummaryResult.recordset[0]?.sales_orders || 0),
    warehouse_count: Number(inventorySummaryResult.recordset[0]?.warehouse_count || 0),
    inventory_items: Number(inventorySummaryResult.recordset[0]?.inventory_items || 0),
    total_products: Number(productSummaryResult.recordset[0]?.total_products || 0),
    low_stock_products: lowStockProductsResult.recordset.map((record) => ({
      product_id: record.product_id,
      product_name: record.product_name,
      image_url: record.image_url,
      remaining_stock: Number(record.remaining_stock || 0),
      status: Number(record.remaining_stock || 0) <= 10 ? "Very low" : "Low",
    })),
    top_products: topProductsResult.recordset.map((record) => ({
      product_id: record.product_id,
      product_name: record.product_name,
      image_url: record.image_url,
      sold_quantity: Number(record.sold_quantity || 0),
      revenue: Number(record.revenue || 0),
      remaining_stock: Number(record.remaining_stock || 0),
      status: Number(record.remaining_stock || 0) <= 10 ? "Very low" : "Low",
    })),
    sales_purchase_trend: trend,
    best_seller: bestSeller
      ? {
          product_id: bestSeller.product_id,
          product_name: bestSeller.product_name,
          category: bestSeller.category,
          image_url: bestSeller.image_url,
          sold_quantity: Number(bestSeller.sold_quantity || 0),
          revenue: Number(bestSeller.revenue || 0),
        }
      : null,
    updated_at: new Date().toISOString(),
  };
}

async function getDiscountByCode(code) {
  if (!code) {
    return null;
  }

  const result = await query(
    `
      SELECT TOP 1
        code,
        discount_type,
        discount_value
      FROM dbo.DiscountCodes
      WHERE code = @code
        AND is_active = 1
    `,
    { code: String(code).trim().toUpperCase() }
  );

  const discount = result.recordset[0];

  return discount
    ? {
        code: discount.code,
        discount_type: discount.discount_type,
        discount_value: Number(discount.discount_value || 0),
      }
    : null;
}

async function searchCustomers(search = "") {
  await query(`
    MERGE dbo.Customers AS target
    USING (
      SELECT
        MAX(customer_name) AS customer_name,
        customer_phone AS phone_number,
        SUM(points_earned) - SUM(points_redeemed) AS loyalty_points
      FROM dbo.Orders
      WHERE customer_phone IS NOT NULL
        AND LTRIM(RTRIM(customer_phone)) <> ''
        AND customer_name IS NOT NULL
        AND LTRIM(RTRIM(customer_name)) <> ''
      GROUP BY customer_phone
    ) AS source
    ON target.phone_number = source.phone_number
    WHEN NOT MATCHED THEN
      INSERT (customer_name, phone_number, loyalty_points)
      VALUES (
        source.customer_name,
        source.phone_number,
        CASE WHEN source.loyalty_points < 0 THEN 0 ELSE source.loyalty_points END
      )
    WHEN MATCHED THEN
      UPDATE SET
        customer_name = source.customer_name,
        loyalty_points = CASE
          WHEN source.loyalty_points < 0 THEN 0
          WHEN target.loyalty_points < source.loyalty_points THEN source.loyalty_points
          ELSE target.loyalty_points
        END,
        updated_at = SYSUTCDATETIME();
  `);

  const normalizedSearch = String(search || "").trim();
  const result = await query(
    `
      SELECT TOP 10
        customer_id,
        customer_name,
        phone_number,
        loyalty_points
      FROM dbo.Customers
      WHERE @search = ''
        OR customer_name LIKE '%' + @search + '%'
        OR phone_number LIKE '%' + @search + '%'
      ORDER BY
        CASE WHEN phone_number = @search THEN 0 ELSE 1 END,
        customer_name ASC
    `,
    { search: normalizedSearch }
  );

  return result.recordset.map((record) => ({
    customer_id: record.customer_id,
    customer_name: record.customer_name,
    phone_number: record.phone_number,
    loyalty_points: Number(record.loyalty_points || 0),
  }));
}

async function resolveCustomer(data) {
  const customerId = Number(data.customer_id || 0);
  const customerName = String(data.customer_name || "").trim();
  const customerPhone = String(data.customer_phone || "").trim();

  if (customerId) {
    const result = await query(
      `
        SELECT customer_id, customer_name, phone_number, loyalty_points
        FROM dbo.Customers
        WHERE customer_id = @customer_id
      `,
      { customer_id: customerId }
    );

    const customer = result.recordset[0];

    if (!customer) {
      const error = new Error("Customer not found");
      error.statusCode = 404;
      throw error;
    }

    return customer;
  }

  if (!customerPhone) {
    return null;
  }

  const existingResult = await query(
    `
      SELECT customer_id, customer_name, phone_number, loyalty_points
      FROM dbo.Customers
      WHERE phone_number = @phone_number
    `,
    { phone_number: customerPhone }
  );

  const existingCustomer = existingResult.recordset[0];

  if (existingCustomer) {
    if (customerName && existingCustomer.customer_name !== customerName) {
      await query(
        `
          UPDATE dbo.Customers
          SET
            customer_name = @customer_name,
            updated_at = SYSUTCDATETIME()
          WHERE customer_id = @customer_id
        `,
        {
          customer_id: existingCustomer.customer_id,
          customer_name: customerName,
        }
      );

      return {
        ...existingCustomer,
        customer_name: customerName,
      };
    }

    return existingCustomer;
  }

  if (!customerName) {
    return null;
  }

  const createdResult = await query(
    `
      INSERT INTO dbo.Customers (customer_name, phone_number, loyalty_points)
      OUTPUT inserted.customer_id, inserted.customer_name, inserted.phone_number, inserted.loyalty_points
      VALUES (@customer_name, @phone_number, 0)
    `,
    {
      customer_name: customerName,
      phone_number: customerPhone,
    }
  );

  return createdResult.recordset[0];
}

async function updateCustomerPoints(customerId, pointsRedeemed, pointsEarned) {
  if (!customerId) {
    return;
  }

  await query(
    `
      UPDATE dbo.Customers
      SET
        loyalty_points = CASE
          WHEN loyalty_points - @points_redeemed + @points_earned < 0 THEN 0
          ELSE loyalty_points - @points_redeemed + @points_earned
        END,
        updated_at = SYSUTCDATETIME()
      WHERE customer_id = @customer_id
    `,
    {
      customer_id: Number(customerId),
      points_redeemed: Number(pointsRedeemed || 0),
      points_earned: Number(pointsEarned || 0),
    }
  );
}

async function adjustInventoryForOrder(items, orderType) {
  const isPurchaseOrder = String(orderType || "").toLowerCase().includes("purchase");

  for (const item of items) {
    if (isPurchaseOrder) {
      const rowsResult = await query(
        `
          SELECT TOP 1 inventory_id
          FROM dbo.Inventory
          WHERE product_id = @product_id
          ORDER BY inventory_id ASC
        `,
        { product_id: item.product_id }
      );

      const inventoryRow = rowsResult.recordset[0];

      if (inventoryRow) {
        await query(
          `
            UPDATE dbo.Inventory
            SET
              quantity = quantity + @quantity,
              movement_date = CAST(GETDATE() AS DATE)
            WHERE inventory_id = @inventory_id
          `,
          {
            inventory_id: inventoryRow.inventory_id,
            quantity: item.quantity,
          }
        );
      } else {
        await query(
          `
            INSERT INTO dbo.Inventory (product_id, store_id, quantity, movement_date)
            SELECT TOP 1
              @product_id,
              s.store_id,
              @quantity,
              CAST(GETDATE() AS DATE)
            FROM dbo.Stores s
            ORDER BY s.store_id
          `,
          {
            product_id: item.product_id,
            quantity: item.quantity,
          }
        );
      }
    } else {
      let remaining = item.quantity;
      const rowsResult = await query(
        `
          SELECT inventory_id, quantity
          FROM dbo.Inventory
          WHERE product_id = @product_id
          ORDER BY quantity DESC, inventory_id ASC
        `,
        { product_id: item.product_id }
      );

      for (const row of rowsResult.recordset) {
        if (remaining <= 0) {
          break;
        }

        const decrement = Math.min(Number(row.quantity || 0), remaining);

        if (decrement > 0) {
          await query(
            `
              UPDATE dbo.Inventory
              SET
                quantity = quantity - @quantity,
                movement_date = CAST(GETDATE() AS DATE)
              WHERE inventory_id = @inventory_id
            `,
            {
              inventory_id: row.inventory_id,
              quantity: decrement,
            }
          );

          remaining -= decrement;
        }
      }
    }

    const stockResult = await query(
      `
        SELECT ISNULL(SUM(quantity), 0) AS quantity
        FROM dbo.Inventory
        WHERE product_id = @product_id
      `,
      { product_id: item.product_id }
    );
    const quantity = Number(stockResult.recordset[0]?.quantity || 0);
    const priceStock = quantity <= 0 ? "Out of Stock" : quantity <= 20 ? "Low Stock" : "In Stock";

    await query(
      `
        UPDATE dbo.Products
        SET price_stock = @price_stock
        WHERE product_id = @product_id
      `,
      {
        product_id: item.product_id,
        price_stock: priceStock,
      }
    );
  }
}

async function ensureSupplierExists(supplierId) {
  const result = await query(
    `
      SELECT supplier_id
      FROM dbo.Suppliers
      WHERE supplier_id = @supplier_id
    `,
    { supplier_id: Number(supplierId) }
  );

  if (!result.recordset.length) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }
}

async function ensureUserExists(userId) {
  const result = await query(
    `
      SELECT user_id
      FROM dbo.Users
      WHERE user_id = @user_id
    `,
    { user_id: Number(userId) }
  );

  if (!result.recordset.length) {
    const error = new Error("Created user not found");
    error.statusCode = 404;
    throw error;
  }
}

async function getProductMap(items) {
  const products = {};

  for (const item of items) {
    const result = await query(
      `
        SELECT product_id, price
        FROM dbo.Products
        WHERE product_id = @product_id
      `,
      { product_id: Number(item.product_id) }
    );

    const product = result.recordset[0];

    if (!product) {
      const error = new Error(`Product not found: ${item.product_id}`);
      error.statusCode = 404;
      throw error;
    }

    products[product.product_id] = product;
  }

  return products;
}

async function createOrder(data, currentUser = null) {
  const supplierId = Number(data.supplier_id);
  const orderType = data.order_type || "Sales Order";
  const isPurchaseOrder = String(orderType).toLowerCase().includes("purchase");
  const createdBy = Number(currentUser?.userId || data.created_by || 1);
  const items = Array.isArray(data.items) ? data.items : [];

  if (String(currentUser?.roleName || "").toLowerCase() === "admin" && !isPurchaseOrder) {
    const error = new Error("Admin cannot create sales orders");
    error.statusCode = 403;
    throw error;
  }

  if (!supplierId) {
    const error = new Error("supplier_id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!items.length) {
    const error = new Error("At least one order item is required");
    error.statusCode = 400;
    throw error;
  }

  await ensureSupplierExists(supplierId);
  await ensureUserExists(createdBy);
  const customer = await resolveCustomer(data);

  const productMap = await getProductMap(items);
  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const product = productMap[Number(item.product_id)];
    const unitPrice = Number(item.unit_price ?? product.price);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      const error = new Error("Item quantity must be greater than 0");
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      const error = new Error("Item unit_price must be non-negative");
      error.statusCode = 400;
      throw error;
    }

    return {
      product_id: Number(item.product_id),
      quantity,
      unit_price: unitPrice,
      line_total: quantity * unitPrice,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.line_total, 0);
  const discountCode = data.discount_code ? String(data.discount_code).trim().toUpperCase() : null;
  const discount = await getDiscountByCode(discountCode);
  const manualDiscountAmount = Number(data.discount_amount || 0);
  const discountAmount = discount
    ? discount.discount_type === "percent"
      ? (subtotal * discount.discount_value) / 100
      : discount.discount_value
    : manualDiscountAmount;
  const taxRate = Number(data.tax_rate || 0);
  const availablePoints = Number(customer?.loyalty_points || 0);
  const requestedPoints = Math.max(0, Math.floor(Number(data.points_redeemed || 0)));
  const pointsRedeemed = Math.min(requestedPoints, availablePoints);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const totalBeforePoints = taxableAmount + (taxableAmount * taxRate) / 100;
  const pointsDiscount = Math.min(pointsRedeemed * 1000, totalBeforePoints);
  const totalAmount = Math.max(0, totalBeforePoints - pointsDiscount);
  const pointsEarned = Math.floor(totalAmount / 100000);
  const orderCode = data.order_code || await getNextOrderCode();

  const orderResult = await query(
    `
      INSERT INTO dbo.Orders (
        order_code,
        order_type,
        supplier_id,
        customer_id,
        created_by,
        order_date,
        expected_delivery_date,
        total_amount,
        order_status,
        payment_method,
        payment_status,
        discount_amount,
        discount_code,
        tax_rate,
        shipping_address,
        notes,
        customer_name,
        customer_phone,
        points_redeemed,
        points_discount,
        points_earned
      )
      OUTPUT inserted.order_id
      VALUES (
        @order_code,
        @order_type,
        @supplier_id,
        @customer_id,
        @created_by,
        @order_date,
        @expected_delivery_date,
        @total_amount,
        @order_status,
        @payment_method,
        @payment_status,
        @discount_amount,
        @discount_code,
        @tax_rate,
        @shipping_address,
        @notes,
        @customer_name,
        @customer_phone,
        @points_redeemed,
        @points_discount,
        @points_earned
      )
    `,
    {
      order_code: orderCode,
      order_type: orderType,
      supplier_id: supplierId,
      customer_id: customer?.customer_id || null,
      created_by: createdBy,
      order_date: data.order_date ? new Date(data.order_date) : new Date(),
      expected_delivery_date: data.expected_delivery_date ? new Date(data.expected_delivery_date) : null,
      total_amount: totalAmount,
      order_status: data.order_status || "Pending",
      payment_method: data.payment_method || "Bank Transfer",
      payment_status: data.payment_status || "Unpaid",
      discount_amount: discountAmount,
      discount_code: discount ? discount.code : null,
      tax_rate: taxRate,
      shipping_address: data.shipping_address || null,
      notes: data.notes || null,
      customer_name: customer?.customer_name || data.customer_name || null,
      customer_phone: customer?.phone_number || data.customer_phone || null,
      points_redeemed: pointsRedeemed,
      points_discount: pointsDiscount,
      points_earned: pointsEarned,
    }
  );

  const orderId = orderResult.recordset[0].order_id;

  for (const item of normalizedItems) {
    await query(
      `
        INSERT INTO dbo.OrderItems (
          order_id,
          product_id,
          quantity,
          unit_price,
          line_total
        )
        VALUES (
          @order_id,
          @product_id,
          @quantity,
          @unit_price,
          @line_total
        )
      `,
      {
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
      }
    );
  }

  await adjustInventoryForOrder(normalizedItems, orderType);
  await updateCustomerPoints(customer?.customer_id, pointsRedeemed, pointsEarned);

  return getOrderById(orderId);
}

async function deleteOrder(id) {
  const orderId = Number(id);
  const existingOrder = await getOrderById(orderId);

  if (!existingOrder) {
    return false;
  }

  try {
    await query(
      `
        DELETE FROM dbo.OrderItems
        WHERE order_id = @order_id
      `,
      { order_id: orderId }
    );

    const result = await query(
      `
        DELETE FROM dbo.Orders
        OUTPUT deleted.order_id
        WHERE order_id = @order_id
      `,
      { order_id: orderId }
    );

    return result.recordset.length > 0;
  } catch (error) {
    if (error.message && error.message.includes("REFERENCE constraint")) {
      const referenceError = new Error("Cannot delete order because it is being used by other records");
      referenceError.statusCode = 409;
      throw referenceError;
    }

    throw error;
  }
}

async function updateOrderStatus(id, status) {
  const orderId = Number(id);
  const normalizedStatus = String(status || "").trim();

  if (!["Pending", "Approved", "Completed", "Cancelled"].includes(normalizedStatus)) {
    const error = new Error("Invalid order status");
    error.statusCode = 400;
    throw error;
  }

  const existingOrder = await getOrderById(orderId);

  if (!existingOrder) {
    return null;
  }

  if (!String(existingOrder.order_type || "").toLowerCase().includes("purchase")) {
    const error = new Error("Only purchase order status can be updated here");
    error.statusCode = 400;
    throw error;
  }

  await query(
    `
      UPDATE dbo.Orders
      SET order_status = @order_status
      WHERE order_id = @order_id
    `,
    {
      order_id: orderId,
      order_status: normalizedStatus,
    }
  );

  return getOrderById(orderId);
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
