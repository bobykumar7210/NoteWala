import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { validateRegister } from "../validators";
import { ROUTES, APP_TITLES } from "../utils/constants";

/**
 * Custom hook encapsulating registration form state, validation, and submission logic
 */
export function useRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    document.title = APP_TITLES.REGISTER;
  }, []);

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "", server: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateRegister(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await registerUser({
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccessMessage("Account created! Redirecting to login…");
      setTimeout(() => navigate(ROUTES.LOGIN), 1500);
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
    successMessage,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isShaking,
    handleChange,
    handleSubmit,
  };
}
