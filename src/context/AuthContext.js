"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { loginRequest } from "@/services/authService";
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  parseSession,
  saveSession,
  subscribeToSession,
} from "@/lib/session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Re-renders whenever the session in localStorage changes (also from other tabs).
  const rawSession = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );

  const login = useCallback(async (username, password) => {
    const data = await loginRequest(username, password);
    saveSession(data);
  }, []);

  const logout = useCallback(() => clearSession(), []);

  const value = useMemo(() => {
    if (rawSession === undefined) {
      return { status: "loading", user: null, login, logout };
    }
    const session = parseSession(rawSession);
    return session
      ? { status: "authenticated", user: session.user, login, logout }
      : { status: "unauthenticated", user: null, login, logout };
  }, [rawSession, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
