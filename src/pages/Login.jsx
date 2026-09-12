import { Link } from "react-router-dom";
import { useLogin } from "../hooks";
import { ROUTES } from "../utils/constants";
import {
  LogoIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertIcon,
} from "../components/common/Icons";
import "../styles/theme.css";

function Login() {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    isShaking,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="auth-page">
      <div className={`auth-card ${isShaking ? "shake" : ""}`}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <LogoIcon size={24} color="#ffffff" />
          </div>
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
              <span className="icon">
                <UserIcon size={18} color="#ffffff" />
              </span>
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
              <span className="icon">
                <LockIcon size={18} color="#ffffff" />
              </span>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} color="#ffffff" />
                ) : (
                  <EyeIcon size={18} color="#ffffff" />
                )}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Server error */}
          {errors.server && (
            <div className="alert alert-error">
              <AlertIcon size={18} color="#ffffff" />
              <span>{errors.server}</span>
            </div>
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
