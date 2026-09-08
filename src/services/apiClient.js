import { BASE_URL, STORAGE_KEYS } from "../utils/constants";

/**
 * Centralized API client wrapping fetch with auto-token injection and 401 handling
 * @param {string} endpoint - API route path (e.g. "/notes") or full URL
 * @param {RequestInit} [options={}] - Standard Fetch options
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // If token exists and Authorization header is not explicitly set, attach Bearer token
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  // Intercept expired or invalid token (HTTP 401)
  if (response.status === 401) {
    window.dispatchEvent(
      new CustomEvent("auth:expired", {
        detail: {
          message: data?.message || "Invalid or expired token",
          statusCode: 401,
        },
      })
    );
    throw new Error(data?.message || "Invalid or expired token");
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export default apiClient;
