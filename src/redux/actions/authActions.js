import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  CLEAR_AUTH_ERROR,
} from "../types/authTypes";
import { loginUser, registerUser, getUserProfile } from "../../services/authService";
import { STORAGE_KEYS } from "../../utils/constants";

// ── Plain Action Creators ───────────────────────────────────────────
export const loginRequest = () => ({ type: LOGIN_REQUEST });

export const loginSuccess = (token, user) => ({
  type: LOGIN_SUCCESS,
  payload: { token, user },
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const registerRequest = () => ({ type: REGISTER_REQUEST });

export const registerSuccess = () => ({ type: REGISTER_SUCCESS });

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

export const logoutAction = () => ({ type: LOGOUT });

export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR });

// ── Async Thunk Creators ────────────────────────────────────────────

/**
 * Thunk to log in a user, persist credentials, and retrieve profile
 */
export const loginUserThunk = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const data = await loginUser(credentials);
    const token = data.token;
    let userData = { username: credentials.username?.trim() };

    try {
      const profile = await getUserProfile(token);
      if (profile) userData = profile;
    } catch {
      // Fallback to username if profile request fails
    }

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

    dispatch(loginSuccess(token, userData));
    return { success: true, token, user: userData };
  } catch (error) {
    const errorMessage = error.message || "Failed to log in. Please try again.";
    dispatch(loginFailure(errorMessage));
    throw error;
  }
};

/**
 * Thunk to register a new user
 */
export const registerUserThunk = (userData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const result = await registerUser(userData);
    dispatch(registerSuccess());
    return result;
  } catch (error) {
    const errorMessage = error.message || "Failed to register. Please try again.";
    dispatch(registerFailure(errorMessage));
    throw error;
  }
};

/**
 * Thunk to log out and clear storage
 */
export const logoutUserThunk = () => (dispatch) => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  dispatch(logoutAction());
};
