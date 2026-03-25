import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, SignupCredentials } from '../../types/auth.ts';
import { signIn, signUp, signOut, getCurrentUser } from '../../lib/auth-api.ts';
import { getToken } from '../../lib/token-storage.ts';
import { AuthContext } from './auth-context.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

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
    await signOut();
    setUser(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
