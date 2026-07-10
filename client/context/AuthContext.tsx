"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configure axios default settings
axios.defaults.withCredentials = true;

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // 401 Unauthorized expected if guest
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
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data && res.data.success) {
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
      const res = await axios.post('/api/auth/register', { name, email, phone, password });
      if (res.data && res.data.success) {
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
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (error: any) {
      console.error('Logout failed:', error.message);
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
