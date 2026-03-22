import { apiRequest } from "../auth/authService";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function getSuppliers() {
  const response = await apiRequest("/api/suppliers");
  const data = await parseResponse(response, "Failed to fetch suppliers");
  return data.data || [];
}

export async function getSupplierDetail(id) {
  const response = await apiRequest(`/api/suppliers/${id}`);
  const data = await parseResponse(response, "Failed to fetch supplier detail");
  return data.data;
}

export async function createSupplier(payload) {
  const response = await apiRequest("/api/suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response, "Failed to create supplier");
  return data.data;
}

export async function updateSupplier(id, payload) {
  const response = await apiRequest(`/api/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response, "Failed to update supplier");
  return data.data;
}

export async function uploadSupplierImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiRequest("/api/uploads/image", {
    method: "POST",
    body: formData,
  });

  const data = await parseResponse(response, "Failed to upload image");
  return data.data;
}
