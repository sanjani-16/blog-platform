import React, { useState } from "react";
import { useAuth } from "../context/authcontext"; // adjust the path if needed
import "../styles/auth.css";
const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password); // ✅ call register with three params
  };

  return (
    <div className="register-container">
      {/* Left side - Branding */}
      <div className="register-left">
        <div className="register-left-content">
          <div className="register-phone-mockup"></div>
          <h1 className="register-brand">InstaLike</h1>
          <p className="register-tag">Join our community of creators</p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="register-right">
        <div className="register-card">
          <h1 className="register-logo">InstaLike</h1>
          <h2 className="register-title">Create an account</h2>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="register-input"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="register-input"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="register-input"
              placeholder="Choose a Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="register-btn">Sign Up</button>
          </form>

          <p className="register-bottom-cta">
            Already have an account? <a href="/login" className="register-link">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
