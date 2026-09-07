import { BASE_URL } from "../utils/constants";

/**
 * Log in user with username and password
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ token: string, user?: object }>}
 */
export async function loginUser({ username, password }) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
}

/**
 * Register a new user
 * @param {{ username: string, email: string, password: string }} userData
 * @returns {Promise<object>}
 */
export async function registerUser({ username, email, password }) {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Registration failed");
  }

  return data;
}

/**
 * Fetch the authenticated user's profile
 * @param {string} token
 * @returns {Promise<object>}
 */
export async function getUserProfile(token) {
  const response = await fetch(`${BASE_URL}/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch profile");
  }

  return data.data || data;
}
