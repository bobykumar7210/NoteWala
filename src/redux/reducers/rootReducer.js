import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import noteReducer from "../slices/noteSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  notes: noteReducer,
});
