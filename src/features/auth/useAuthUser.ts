import type { User, UpdateUserData } from '../../types/auth.ts';
import { useAuth } from './useAuth.ts';

interface AuthUserValue {
  user: User;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  refreshUser: () => Promise<void>;
  decrementUnreadCount: () => void;
}

// Use inside components rendered under ProtectedRoute, where the user is
// guaranteed to be loaded. Throws if called from a public/anonymous context.
export function useAuthUser(): AuthUserValue {
  const { user, logout, updateUser, refreshUser, decrementUnreadCount } = useAuth();
  if (!user) {
    throw new Error('useAuthUser called without an authenticated user');
  }
  return { user, logout, updateUser, refreshUser, decrementUnreadCount };
}
