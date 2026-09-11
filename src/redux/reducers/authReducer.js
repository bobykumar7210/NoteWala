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
import { STORAGE_KEYS } from "../../utils/constants";

// Read initial token & user from localStorage safely
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

/**
 * Traditional Redux Pure Reducer for Auth State
 */
export function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}
