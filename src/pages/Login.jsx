import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, getUserProfile } from "../services/authService";
import { validateLogin } from "../validators";
import { ROUTES, APP_TITLES } from "../utils/constants";
import "../styles/theme.css";

function Login() {
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
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "", server: "" }));
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

      // Attempt to fetch full user profile with the token, fallback to username
      let userData = { username: formData.username.trim() };
      try {
        const profile = await getUserProfile(data.token);
        if (profile) userData = profile;
      } catch {
        // Continue with basic user info if profile fetch fails
      }

      // Save token & user via AuthContext (persists to localStorage)
      login(data.token, userData);
      navigate(ROUTES.HOME);
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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your Notewala account</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <div className="input-wrap">
              <input
                id="login-username"
                type="text"
                name="username"
                placeholder="Your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
              <span className="icon">👤</span>
            </div>
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="has-toggle"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          {/* Server error */}
          {errors.server && (
            <div className="alert alert-error">⚠️ {errors.server}</div>
          )}

          <button id="login-submit" type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="btn-spinner" />
                <span>Signing in…</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to={ROUTES.REGISTER}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
