import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUserThunk,
  clearAuthError,
  selectAuthLoading,
  selectAuthError,
} from "../redux";
import { validateRegister } from "../validators";
import { ROUTES, APP_TITLES } from "../utils/constants";

/**
 * Custom hook encapsulating registration form state, validation, and submission logic via Redux Toolkit
 */
export function useRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxLoading = useSelector(selectAuthLoading);
  const reduxError = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    document.title = APP_TITLES.REGISTER;
    dispatch(clearAuthError());
  }, [dispatch]);

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

    try {
      const result = await dispatch(
        registerUserThunk({
          username: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        })
      );

      if (registerUserThunk.fulfilled.match(result)) {
        setSuccessMessage("Account created! Redirecting to login…");
        setTimeout(() => navigate(ROUTES.LOGIN), 1500);
      } else {
        throw new Error(result.payload || "Registration failed");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        server: error.message || reduxError || "Something went wrong. Please try again.",
      }));
      triggerShake();
    }
  }

  return {
    formData,
    errors,
    isLoading: reduxLoading,
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
