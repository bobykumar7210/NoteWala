import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/constant";
import "../../theme.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign In — Notewala";
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // Save token via AuthContext (also persists to localStorage)
      login(data.token, { username: formData.username });
      navigate("/");

    } catch (error) {
      setErrors(prev => ({
        ...prev,
        server: error.message || "Something went wrong. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

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
                type="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span className="icon">🔒</span>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Server error */}
          {errors.server && (
            <div className="alert alert-error">⚠️ {errors.server}</div>
          )}

          <button id="login-submit" type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
