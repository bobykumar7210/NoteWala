import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { noteReducer } from "./noteReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  notes: noteReducer,
});
