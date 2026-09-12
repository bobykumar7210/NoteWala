import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, getUserProfile } from "../../services/authService";
import { STORAGE_KEYS } from "../../utils/constants";

// Read initial token & user safely from localStorage
const initialToken = localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
let initialUser = null;
try {
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
  if (storedUser) initialUser = JSON.parse(storedUser);
} catch {
  initialUser = null;
}

const initialState = {
  token: initialToken,
  user: initialUser,
  isAuthenticated: Boolean(initialToken),
  isLoading: false,
  error: null,
};

// ── Async Thunks ───────────────────────────────────────────────────

/**
 * Async thunk to log in user, fetch profile, and persist to localStorage
 */
export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      const token = data.token;
      let userData = { username: credentials.username?.trim() };

      try {
        const profile = await getUserProfile(token);
        if (profile) userData = profile;
      } catch {
        // Fallback to username if profile fetch fails
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      return { token, user: userData };
    } catch (error) {
      const errorMessage = error.message || "Failed to log in. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to register a new user
 */
export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await registerUser(userData);
      return result;
    } catch (error) {
      const errorMessage = error.message || "Failed to register. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk / action to log out user and clear storage
 */
export const logoutUserThunk = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    dispatch(logoutAction());
    return true;
  }
);

// ── Auth Slice ─────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    logoutAction: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || "Login failed";
      })
      // ── Register ──
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || "Registration failed";
      });
  },
});

export const { loginSuccess, logoutAction, clearAuthError } = authSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────
export const selectAuth = (state) => state.auth;
export const selectAuthToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
