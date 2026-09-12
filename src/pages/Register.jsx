import { Link } from "react-router-dom";
import { useRegister } from "../hooks";
import { ROUTES } from "../utils/constants";
import {
  LogoIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  AlertIcon,
  CheckIcon,
} from "../components/common/Icons";
import "../styles/theme.css";

function Register() {
  const {
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
  } = useRegister();

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
              <span className="icon">
                <UserIcon size={18} color="#ffffff" />
              </span>
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
              <span className="icon">
                <MailIcon size={18} color="#ffffff" />
              </span>
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
              <span className="icon">
                <KeyIcon size={18} color="#ffffff" />
              </span>
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                title={showConfirmPassword ? "Hide password" : "Show password"}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon size={18} color="#ffffff" />
                ) : (
                  <EyeIcon size={18} color="#ffffff" />
                )}
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
            <div className="alert alert-error">
              <AlertIcon size={18} color="#ffffff" />
              <span>{errors.server}</span>
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success">
              <CheckIcon size={18} color="#ffffff" />
              <span>{successMessage}</span>
            </div>
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
          Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
