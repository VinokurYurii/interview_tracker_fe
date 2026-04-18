import { createContext } from 'react';
import type { LoginCredentials, SignupCredentials, UpdateUserData, User } from '../../types/auth.ts';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  refreshUser: () => Promise<void>;
  decrementUnreadCount: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
