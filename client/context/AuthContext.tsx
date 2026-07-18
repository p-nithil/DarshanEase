"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

// ─── Token helpers (localStorage for cross-domain Vercel → Render) ───────────
const TOKEN_KEY = 'darshan_token';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /** Validate the stored token against the backend and hydrate user state */
  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/api/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.user);
      } else {
        clearToken();
        setUser(null);
      }
    } catch {
      // 401 = expired/invalid token — treat as guest
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data && res.data.success) {
        if (res.data.token) saveToken(res.data.token);
        setUser(res.data.user);
      }
    } catch (error: any) {
      setUser(null);
      const errMsg = error.response?.data?.message || 'Invalid email or password';
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/register', { name, email, phone, password });
      if (res.data && res.data.success) {
        if (res.data.token) saveToken(res.data.token);
        setUser(res.data.user);
      }
    } catch (error: any) {
      setUser(null);
      const errMsg = error.response?.data?.message || 'Registration failed';
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      clearToken();
      setUser(null);
      await api.post('/api/auth/logout').catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
