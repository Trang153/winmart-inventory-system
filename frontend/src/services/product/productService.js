import { apiRequest } from "../auth/authService";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function getProducts() {
  const response = await apiRequest("/api/products");
  const data = await parseResponse(response, "Failed to fetch products");
  return data.data || [];
}

export async function getProductDetail(id) {
  const response = await apiRequest(`/api/products/${id}`);
  const data = await parseResponse(response, "Failed to fetch product detail");
  return data.data;
}

export async function createProduct(payload) {
  const response = await apiRequest("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response, "Failed to create product");
  return data.data;
}

export async function updateProduct(id, payload) {
  const response = await apiRequest(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response, "Failed to update product");
  return data.data;
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiRequest("/api/uploads/image", {
    method: "POST",
    body: formData,
  });

  const data = await parseResponse(response, "Failed to upload image");
  return data.data;
}
