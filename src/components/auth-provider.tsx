"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { AuthResponse, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

const STORAGE_KEY = "workly-auth";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setAuth(JSON.parse(saved) as AuthResponse);
    } finally {
      setReady(true);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      ready,
      login(nextAuth) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
        setAuth(nextAuth);
      },
      logout() {
        window.localStorage.removeItem(STORAGE_KEY);
        setAuth(null);
      },
    }),
    [auth, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
