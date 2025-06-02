"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userToken: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsAuthenticated(true);
      setUserToken(token);
    } else {
      setIsAuthenticated(false);
      setUserToken(null);
    }
    setIsLoadingAuth(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("userToken", token);
    setUserToken(token); // ← update token
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setUserToken(null); // ← clear token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoadingAuth, login, logout, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
