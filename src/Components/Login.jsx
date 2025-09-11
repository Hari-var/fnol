import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = ({ setLogin }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/auth/token?remember=${remember}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: username,
        password: password,
      }),
      credentials: "include", // store cookie in browser
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          setError("⚠️ " + data.detail);
        } else {
          // localStorage.setItem("token", data.access_token);
          setError(null);
          setLogin(true);
          navigate("/policies");
        }
      })
      .catch((err) => setError("Something went wrong. Please try again later."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <div className="login-meta">
          <img
            src="logos/ValueMomentum Corporate Logo 2024 - transparent.png"
            alt="ValueMomentum Logo"
          />
          <h2>Login</h2>
          <p className="subtitle">Enter your credentials to access your account</p>
        </div>

        {/* 🔹 Show Error */}
        {error && <div className="error-message">{error}</div>}

        {/* 🔹 Show Loading */}
        {loading && <div className="loading-message">Authenticating...</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="email"
              name="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email / User name</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="options">
            <label htmlFor="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="signup">
          Don’t have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
