'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api-client';
import { handleApiError } from '@/lib/errors';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeUserIdFromToken(token: string): number | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = JSON.parse(atob(payload));
    if (typeof json.id === 'number') return json.id;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (!token) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn('Failed to parse stored user, clearing cache', err);
        localStorage.removeItem('auth_user');
      }
    }

    setLoading(false);
  };

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      if (response.error) {
        return { success: false, error: handleApiError(response.error) };
      }
      if (response.data?.result) {
        const token = response.data.result.access_token;
        localStorage.setItem('auth_token', token);

        const id = decodeUserIdFromToken(token);
        const derivedUser: User = {
          id,
          username: credentials.email.split('@')[0] || credentials.email,
          email: credentials.email,
          createdAt: undefined,
        };
        localStorage.setItem('auth_user', JSON.stringify(derivedUser));
        setUser(derivedUser);
        return { success: true };
      }
      return { success: false, error: 'Unknown error' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data);
      if (response.error) {
        return { success: false, error: handleApiError(response.error) };
      }
      if (response.data?.result) {
        const token = response.data.result.access_token;
        localStorage.setItem('auth_token', token);

        const id = decodeUserIdFromToken(token);
        const derivedUser: User = {
          id,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          createdAt: undefined,
        };
        localStorage.setItem('auth_user', JSON.stringify(derivedUser));
        setUser(derivedUser);
        return { success: true };
      }
      return { success: false, error: 'Unknown error' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
      setUser(null);
      router.push('/');
    }
  }, [router]);

  const updateUser = useCallback(async (data: Partial<User>) => {
    // Backend không hỗ trợ cập nhật profile hiện tại, nên chỉ cập nhật local state.
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...data };
      localStorage.setItem('auth_user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    await checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

