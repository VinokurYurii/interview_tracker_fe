import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../features/auth/useAuth.ts';

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/home" replace />;

  return <>{children}</>;
}
