import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      console.log("🔍 Sending login payload:", { email, password });

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: String(email).trim(),
        password: String(password).trim(),
      });

      console.log("✅ Login response:", res.data);

      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        console.error("❌ No user data in response");
        alert("Login failed: No user data received");
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      console.error("❌ Full error:", err);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: String(name).trim(),
        email: String(email).trim(),
        password: String(password).trim(),
      });

      if (res.data.user) {
        setUser(res.data.user);
        navigate("/home");
      }
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Register failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
