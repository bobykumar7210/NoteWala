import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import noteReducer from "./slices/noteSlice";

/**
 * Modern Redux Store configuration via Redux Toolkit
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
  },
  devTools: import.meta.env.DEV,
});
