import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, getUserProfile } from "../services/authService";
import { validateLogin } from "../validators";
import { ROUTES, APP_TITLES } from "../utils/constants";

/**
 * Custom hook encapsulating login form state, validation, and submission logic
 */
export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    document.title = APP_TITLES.LOGIN;
  }, []);

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", server: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const data = await loginUser({
        username: formData.username.trim(),
        password: formData.password,
      });

      let userData = { username: formData.username.trim() };
      try {
        const profile = await getUserProfile(data.token);
        if (profile) userData = profile;
      } catch {
        // Fallback to username if profile request fails
      }

      login(data.token, userData);
      navigate(ROUTES.HOME);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        server: error.message || "Something went wrong. Please try again.",
      }));
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  }

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    isShaking,
    handleChange,
    handleSubmit,
  };
}
