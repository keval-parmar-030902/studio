
"use client";

import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, firstName: string, lastName: string) => Promise<void>;
  // updateUserOnboardingStatus: (status: boolean) => void; // Removed
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
    const storedUser = localStorage.getItem('dayscribe-user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const updateUserInStorageAndState = (updatedUser: User | null) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('dayscribe-user', JSON.stringify(updatedUser));
    } else {
      setUser(null);
      localStorage.removeItem('dayscribe-user');
    }
  };

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUser = localStorage.getItem('dayscribe-user');
    let loggedInUser: User | null = null;

    if (storedUser) {
        const existingUser = JSON.parse(storedUser) as User;
        if (existingUser.email === email) {
            loggedInUser = existingUser;
        }
    }
    
    if (!loggedInUser) {
        loggedInUser = { 
          id: 'mock-user-id-' + Date.now(), 
          email, 
          firstName: "Demo",
          lastName: "User",
        };
    }
    
    updateUserInStorageAndState(loggedInUser);
    setLoading(false);
    router.push('/dashboard'); // Always go to dashboard after login
  };

  const register = async (email: string, firstName: string, lastName: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = { 
      id: 'mock-user-id-' + Date.now(), 
      email, 
      firstName, 
      lastName,
    };
    updateUserInStorageAndState(newUser);
    setLoading(false);
    router.push('/dashboard'); // Go directly to dashboard after registration
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentUserId = user?.id; 
    updateUserInStorageAndState(null); // Clears user and removes from localStorage
    
    if (currentUserId) {
      localStorage.removeItem(`dayscribe-tasks-${currentUserId}`);
    }
    
    setLoading(false);
    router.push('/login');
  };

  // updateUserOnboardingStatus removed

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
