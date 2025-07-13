/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { createContext, useContext, ReactNode } from "react";


interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (credentials: any) => Promise<any>;
  register: (credentials: any) => Promise<any>;
  logout: () => void;
  refetchProfile: () => void;
  isLoading: boolean;
  error: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  if (!auth.isInitialized) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={auth as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
