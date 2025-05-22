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
  updateUserOnboardingStatus: (status: boolean) => void;
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
      // Initial redirection logic based on onboarding status
      if (parsedUser && parsedUser.hasCompletedOnboarding === false) {
        router.replace('/onboarding/daily-tasks');
      }
    }
    setLoading(false);
  }, [router]);

  const updateUserInStorageAndState = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('dayscribe-user', JSON.stringify(updatedUser));
  };

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // This is a mock login. In a real app, you'd fetch full user data.
    // For simplicity, if a user with this email exists in localStorage, we use that,
    // otherwise, create a new one. This isn't secure for a real app.
    const storedUser = localStorage.getItem('dayscribe-user');
    let loggedInUser: User | null = null;
    if (storedUser) {
        const existingUser = JSON.parse(storedUser) as User;
        if (existingUser.email === email) {
            loggedInUser = existingUser;
        }
    }
    if (!loggedInUser) {
        // If user not found by email from storage, create a basic one.
        // This part of mock would need more robust handling in real app or if multiple users were truly supported by mock.
        loggedInUser = { id: 'mock-user-id-' + Date.now(), email, hasCompletedOnboarding: true }; // Assume existing user completed onboarding
    }
    
    updateUserInStorageAndState(loggedInUser);
    setLoading(false);
    if (loggedInUser.hasCompletedOnboarding === false) {
      router.push('/onboarding/daily-tasks');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (email: string, firstName: string, lastName: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = { 
      id: 'mock-user-id-' + Date.now(), 
      email, 
      firstName, 
      lastName, 
      hasCompletedOnboarding: false // New users start onboarding
    };
    updateUserInStorageAndState(newUser);
    setLoading(false);
    router.push('/onboarding/daily-tasks'); // Redirect to onboarding
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('dayscribe-user');
    // Also clear tasks for logged out user to simulate clean session, optional
    // localStorage.removeItem(`dayscribe-tasks-${user?.id}`); 
    setLoading(false);
    router.push('/login');
  };

  const updateUserOnboardingStatus = useCallback((status: boolean) => {
    setUser(currentUser => {
      if (currentUser) {
        const updatedUser = { ...currentUser, hasCompletedOnboarding: status };
        updateUserInStorageAndState(updatedUser);
        return updatedUser;
      }
      return null;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUserOnboardingStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
