'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface usersPayload {
    username: string;
    password: string;
    rememberMe: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, user: usersPayload) => void;
  logout: () => void;
  user: usersPayload;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<usersPayload>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
      
    }
  }, []);

  const login = (token: string, user: usersPayload) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser({
        username: '',
        password: '',
        rememberMe: false,
    });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
