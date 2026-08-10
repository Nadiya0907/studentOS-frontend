import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('studentos_token');
    const stored = localStorage.getItem('studentos_user');
    if (token) setUser(stored ? JSON.parse(stored) : { name: 'Student', email: 'student@example.com', role: 'student' });
    setLoading(false);
  }, []);

  const persist = (token, userData) => {
    localStorage.setItem('studentos_token', token);
    localStorage.setItem('studentos_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const userData = res.data.user || { name: credentials.email?.split('@')[0] || 'Student', email: credentials.email, role: 'student' };
    persist(res.data.token || 'session-token', userData);
    return res.data;
  };

  const signup = async (data) => authService.signup(data);
  const logout = async () => { await authService.logout(); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
