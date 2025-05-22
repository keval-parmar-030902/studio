"use client";

import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>; // Simplified login
  logout: () => Promise<void>;
  register: (email: string, firstName: string, lastName: string) => Promise<void>; // Updated register
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status on load
    const storedUser = localStorage.getItem('dayscribe-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Login mock doesn't include first/last name, real app would fetch full user data
    const mockUser: User = { id: 'mock-user-id-' + Date.now(), email };
    setUser(mockUser);
    localStorage.setItem('dayscribe-user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const register = async (email: string, firstName: string, lastName: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { id: 'mock-user-id-' + Date.now(), email, firstName, lastName };
    setUser(mockUser);
    localStorage.setItem('dayscribe-user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const logout = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('dayscribe-user');
    setLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
