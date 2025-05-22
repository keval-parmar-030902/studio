
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
      // This check should ideally happen where navigation decisions are made,
      // e.g., in a wrapper component or page/layout effects.
      // For now, it's here for simplicity from previous iterations.
      // if (parsedUser && parsedUser.hasCompletedOnboarding === false) {
      //   router.replace('/onboarding/daily-tasks');
      // }
    }
    setLoading(false);
  }, []); // Removed router from dependencies to avoid re-triggering on route changes from within this effect.

  const updateUserInStorageAndState = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('dayscribe-user', JSON.stringify(updatedUser));
  };

  const login = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedUser = localStorage.getItem('dayscribe-user');
    let loggedInUser: User | null = null;

    if (storedUser) {
        const existingUser = JSON.parse(storedUser) as User;
        // In a real app, you'd verify password here.
        // For mock, we assume if email matches, it's the user.
        if (existingUser.email === email) {
            loggedInUser = existingUser;
        }
    }
    
    if (!loggedInUser) {
        // If user not found by email from storage, create a basic one with mock names.
        // This part of mock would need more robust handling in real app.
        loggedInUser = { 
          id: 'mock-user-id-' + Date.now(), 
          email, 
          firstName: "Demo", // Added mock first name
          lastName: "User",   // Added mock last name
          hasCompletedOnboarding: true // Assume existing/newly-mocked user completed onboarding if not specified
        };
    }
    
    updateUserInStorageAndState(loggedInUser);
    setLoading(false);

    if (loggedInUser.hasCompletedOnboarding === false) { // Check onboarding status
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
    const currentUserId = user?.id; // Get user ID before clearing user state
    setUser(null);
    localStorage.removeItem('dayscribe-user');
    
    // Optionally clear tasks for the logged-out user
    if (currentUserId) {
      localStorage.removeItem(`dayscribe-tasks-${currentUserId}`);
    }
    
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
