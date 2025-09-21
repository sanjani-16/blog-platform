import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axios"; // must have baseURL here

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // helper to attach token for future requests
  const setAuthHeader = (tok) => {
    if (tok) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };

  // apply token if exists on first load
  React.useEffect(() => {
    if (token) {
      setAuthHeader(token);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setAuthHeader(res.data.token);
      setUser({
        id: res.data.id,
        email: res.data.email,
        name: res.data.name,
      });
      return res.data; // optional
    } catch (err) {
      console.error("❌ Login failed:", err);
      throw err; // rethrow so UI can show error message
    }
  };

  const register = async (name, email, password) => {
    try {
      await axiosInstance.post("/auth/register", { name, email, password });
      // auto login after registration
      await login(email, password);
    } catch (err) {
      console.error("❌ Register failed:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
