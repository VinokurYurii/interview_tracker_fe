import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, SignupCredentials, UpdateUserData } from '../../types/auth.ts';
import { signIn, signUp, signOut, getCurrentUser, updateCurrentUser } from '../../lib/auth-api.ts';
import { getToken } from '../../lib/token-storage.ts';
import { AuthContext } from './auth-context.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!getToken());

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let cancelled = false;

    getCurrentUser()
      .then((userData) => {
        if (!cancelled) setUser(userData);
      })
      .catch(() => {
        // Token invalid — cleared by api-client on 401
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const userData = await signIn(credentials);
    setUser(userData);
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    const userData = await signUp(credentials);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
    }
  }, []);

  const updateUser = useCallback(async (data: UpdateUserData) => {
    const userData = await updateCurrentUser(data);
    setUser(userData);
  }, []);

  const refreshUser = useCallback(async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  }, []);

  const decrementUnreadCount = useCallback(() => {
    setUser((prev) =>
      prev ? { ...prev, unread_notifications_count: Math.max(0, prev.unread_notifications_count - 1) } : prev,
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
        decrementUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
