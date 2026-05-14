import { apiRequest } from "../auth/authService";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function getOrders() {
  const response = await apiRequest("/api/orders");
  const data = await parseResponse(response, "Failed to fetch orders");
  return data.data || [];
}

export async function getOrderDetail(id) {
  const response = await apiRequest(`/api/orders/${id}`);
  const data = await parseResponse(response, "Failed to fetch order detail");
  return data.data;
}

export async function getNextOrderCode() {
  const response = await apiRequest("/api/orders/next-code");
  const data = await parseResponse(response, "Failed to fetch next order code");
  return data.data?.order_code || "";
}

export async function getDiscountCodes() {
  const response = await apiRequest("/api/orders/discount-codes");
  const data = await parseResponse(response, "Failed to fetch discount codes");
  return data.data || [];
}

export async function searchCustomers(search = "") {
  const query = new URLSearchParams({ search }).toString();
  const response = await apiRequest(`/api/orders/customers?${query}`);
  const data = await parseResponse(response, "Failed to fetch customers");
  return data.data || [];
}

export async function getOrderReport() {
  const response = await apiRequest("/api/orders/report");
  const data = await parseResponse(response, "Failed to fetch order report");
  return data.data;
}

export async function exportOrderReport(format = "csv") {
  const response = await apiRequest(`/api/orders/report/export?format=${encodeURIComponent(format)}`);

  if (!response.ok) {
    let message = "Failed to export order report";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch (_error) {
      // Keep the fallback message when the backend does not return JSON.
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") || "";
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);

  return {
    blob,
    filename: filenameMatch?.[1] || `order-report.${format === "pdf" ? "pdf" : format === "excel" ? "xls" : "csv"}`,
  };
}

export async function getDashboardSummary() {
  const response = await apiRequest("/api/orders/dashboard-summary");
  const data = await parseResponse(response, "Failed to fetch dashboard summary");
  return data.data;
}

export async function createOrder(payload) {
  const response = await apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response, "Failed to create order");
  return data.data;
}

export async function deleteOrder(id) {
  const response = await apiRequest(`/api/orders/${id}`, {
    method: "DELETE",
  });

  return parseResponse(response, "Failed to delete order");
}

export async function updateOrderStatus(id, status) {
  const response = await apiRequest(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  const data = await parseResponse(response, "Failed to update order status");
  return data.data;
}
