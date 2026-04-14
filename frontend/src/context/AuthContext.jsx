import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Listen for session expiration events from api.js
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
      toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const checkUser = async () => {
    try {
      const res = await api.get('/auth/user');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    checkUser();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
