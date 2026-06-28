import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { mockUsers } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  login: (role: 'candidate' | 'hr' | 'admin', customName?: string, customEmail?: string, rememberMe?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('interviewai_user') || sessionStorage.getItem('interviewai_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const login = (role: 'candidate' | 'hr' | 'admin', customName?: string, customEmail?: string, rememberMe?: boolean) => {
    const baseUser = mockUsers[role];
    const selectedUser = {
      ...baseUser,
      name: customName || baseUser.name,
      email: customEmail || baseUser.email
    };
    const mockToken = `mock-jwt-${role}-${Date.now()}`;
    
    setUser(selectedUser);
    
    const storage = rememberMe ? localStorage : sessionStorage;
    const fallbackStorage = rememberMe ? sessionStorage : localStorage;
    
    // Clear opposite to avoid conflicts
    fallbackStorage.removeItem('interviewai_user');
    fallbackStorage.removeItem('interviewai_role');
    fallbackStorage.removeItem('interviewai_token');
    
    storage.setItem('interviewai_user', JSON.stringify(selectedUser));
    storage.setItem('interviewai_role', role);
    storage.setItem('interviewai_token', mockToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('interviewai_user');
    localStorage.removeItem('interviewai_role');
    localStorage.removeItem('interviewai_token');
    sessionStorage.removeItem('interviewai_user');
    sessionStorage.removeItem('interviewai_role');
    sessionStorage.removeItem('interviewai_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
