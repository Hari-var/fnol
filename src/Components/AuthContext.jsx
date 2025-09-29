// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { path } from "../config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${path}/auth/me`, { 
      headers: {'ngrok-skip-browser-warning': '1'},
      withCredentials: true })
      .then(res => setUser(res.data))  // { username, user_id, role }
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
