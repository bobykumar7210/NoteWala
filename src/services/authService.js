import apiClient from "./apiClient";

/**
 * Log in user with username and password
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ token: string, user?: object }>}
 */
export async function loginUser({ username, password }) {
  return apiClient("/users/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

/**
 * Register a new user
 * @param {{ username: string, email: string, password: string }} userData
 * @returns {Promise<object>}
 */
export async function registerUser({ username, email, password }) {
  return apiClient("/users/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

/**
 * Fetch the authenticated user's profile
 * @param {string} [token]
 * @returns {Promise<object>}
 */
export async function getUserProfile(token) {
  const options = { method: "GET" };
  if (token) {
    options.headers = { Authorization: `Bearer ${token}` };
  }

  const data = await apiClient("/users/profile", options);
  return data.data || data;
}

