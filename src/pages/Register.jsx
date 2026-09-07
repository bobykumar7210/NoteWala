import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/theme.css";

function Register() {
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
    document.title = "Sign Up — Notewala";
  }, []);

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: "", server: "" }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Username is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Username must be at least 3 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.terms) {
      newErrors.terms = "You must accept the terms";
    }
    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
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
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        server: error.message || "Something went wrong. Please try again.",
      }));
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className={`auth-card ${isShaking ? "shake" : ""}`}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">📝</div>
          <span className="auth-logo-text">Notewala</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start taking smarter notes today</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="reg-name">Username</label>
            <div className="input-wrap">
              <input
                id="reg-name"
                type="text"
                name="name"
                placeholder="e.g. johndoe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="username"
              />
              <span className="icon">👤</span>
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <div className="input-wrap">
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <span className="icon">✉️</span>
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="input-wrap">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="has-toggle"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="icon">🔒</span>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={-1}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm password</label>
            <div className="input-wrap">
              <input
                id="reg-confirm"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="has-toggle"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="icon">🔑</span>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                tabIndex={-1}
                title={showConfirmPassword ? "Hide password" : "Show password"}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Terms */}
          <div className="checkbox-row">
            <input
              id="reg-terms"
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <label htmlFor="reg-terms">
              I agree to the Terms &amp; Conditions
            </label>
          </div>
          {errors.terms && (
            <span className="field-error" style={{ marginBottom: 12, display: "block" }}>
              {errors.terms}
            </span>
          )}

          {/* Alerts */}
          {errors.server && (
            <div className="alert alert-error">⚠️ {errors.server}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">✅ {successMessage}</div>
          )}

          <button id="register-submit" type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="btn-spinner" />
                <span>Creating account…</span>
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
