import React, { createContext, useContext, useState } from "react";
import axios from "../api/axios";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser({ id: res.data.id, email: res.data.email, name: res.data.name });
  };
  const register = async (name, email, password) => {
    await axios.post("/auth/register", { name, email, password });
    await login(email, password);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);