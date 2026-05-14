import { apiRequest } from "../auth/authService";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export async function getUsers() {
  const response = await apiRequest("/api/users");
  const data = await parseResponse(response, "Failed to fetch users");
  return data.data || [];
}

export async function getAccessOptions() {
  const response = await apiRequest("/api/users/access-options");
  const data = await parseResponse(response, "Failed to fetch access options");
  return data.data || { roles: [], stores: [] };
}

export async function createUser(payload) {
  const response = await apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response, "Failed to create user");
  return data.data;
}

export async function updateUser(id, payload) {
  const response = await apiRequest(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response, "Failed to update user");
  return data.data;
}

export async function deleteUser(id) {
  const response = await apiRequest(`/api/users/${id}`, {
    method: "DELETE",
  });
  await parseResponse(response, "Failed to delete user");
}
