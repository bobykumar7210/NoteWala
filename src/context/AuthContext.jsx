import { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuthToken,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "../redux/selectors/authSelectors";
import { loginSuccess, logoutUserThunk } from "../redux/actions/authActions";
import { STORAGE_KEYS } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  function login(newToken, userData) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    dispatch(loginSuccess(newToken, userData));
  }

  function logout() {
    dispatch(logoutUserThunk());
  }

  // Listen for session expiry / 401 events from apiClient
  useEffect(() => {
    function handleSessionExpired() {
      dispatch(logoutUserThunk());
    }

    window.addEventListener("auth:expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:expired", handleSessionExpired);
    };
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
