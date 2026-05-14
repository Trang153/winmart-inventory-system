import { apiRequest } from "../auth/authService";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function getReceiptRequests() {
  const response = await apiRequest("/api/receipts");
  const data = await parseResponse(response, "Failed to fetch receipt requests");
  return data.data || [];
}

export async function createReceiptRequest(payload) {
  const response = await apiRequest("/api/receipts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response, "Failed to create receipt request");
  return data.data;
}

export async function reviewReceiptRequest(id, payload) {
  const response = await apiRequest(`/api/receipts/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response, "Failed to review receipt request");
  return data.data;
}

export async function hideReceiptRequest(id) {
  const response = await apiRequest(`/api/receipts/${id}/hide`, {
    method: "PATCH",
  });
  const data = await parseResponse(response, "Failed to hide receipt request");
  return data.data;
}
