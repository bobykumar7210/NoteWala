import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk, clearAuthError } from "../redux/actions/authActions";
import { selectAuthLoading, selectAuthError } from "../redux/selectors/authSelectors";
import { validateLogin } from "../validators";
import { ROUTES, APP_TITLES } from "../utils/constants";

/**
 * Custom hook encapsulating login form state, validation, and submission logic via Redux
 */
export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxLoading = useSelector(selectAuthLoading);
  const reduxError = useSelector(selectAuthError);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    document.title = APP_TITLES.LOGIN;
    dispatch(clearAuthError());
  }, [dispatch]);

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

    try {
      await dispatch(
        loginUserThunk({
          username: formData.username.trim(),
          password: formData.password,
        })
      );
      navigate(ROUTES.HOME);
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
    showPassword,
    setShowPassword,
    isShaking,
    handleChange,
    handleSubmit,
  };
}
