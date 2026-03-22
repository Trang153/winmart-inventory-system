const AUTH_STORAGE_KEY = "winmart-authenticated";
const AUTH_TOKEN_KEY = "winmart-token";
const AUTH_USER_KEY = "winmart-user";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const UNAUTHORIZED_EVENT = "winmart:unauthorized";

export function getAuthSession() {
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function getAccessToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser() {
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (_error) {
    return null;
  }
}

export function setAuthSession({ token, user }) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function notifyUnauthorized() {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

export function subscribeUnauthorized(handler) {
  window.addEventListener(UNAUTHORIZED_EVENT, handler);

  return () => {
    window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  };
}

export async function login({ username, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  setAuthSession({
    token: data.token,
    user: data.user,
  });

  return data;
}

export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthSession();
    notifyUnauthorized();
  }

  return response;
}
