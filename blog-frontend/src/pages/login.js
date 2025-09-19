import React, { useState } from "react";
import { useAuth } from "../context/authcontext"; // adjust the path if needed
import "../styles/auth.css";
const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password); // ✅ call login with two params
  };

  return (
    <div className="login-container">
      {/* Left side - Branding */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-phone-mockup"></div>
          <h1 className="login-brand">InstaLike</h1>
          <p className="login-tag">Share beautiful moments with the world</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="login-right">
        <div className="login-card">
          <h1 className="login-logo">InstaLike</h1>
          <h2 className="login-title">Welcome back</h2>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn">Log In</button>
          </form>

          <p className="login-bottom-cta">
            Don't have an account? <a href="/register" className="login-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
