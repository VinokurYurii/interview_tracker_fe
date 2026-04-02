import type { User, LoginCredentials, SignupCredentials, UpdateUserData } from '../types/auth.ts';
import { apiClient } from './api-client.ts';
import { setToken, removeToken } from './token-storage.ts';

function extractToken(headers: Headers): string | null {
  const auth = headers.get('Authorization');
  if (!auth) return null;
  return auth.replace('Bearer ', '');
}

export async function signIn(credentials: LoginCredentials): Promise<User> {
  const { data, headers } = await apiClient<User>('/api/auth/sign_in', {
    method: 'POST',
    body: JSON.stringify({ user: credentials }),
  });

  const token = extractToken(headers);
  if (token) setToken(token);

  return data;
}

export async function signUp(credentials: SignupCredentials): Promise<User> {
  const { data, headers } = await apiClient<User>('/api/auth/sign_up', {
    method: 'POST',
    body: JSON.stringify({ user: credentials }),
  });

  const token = extractToken(headers);
  if (token) setToken(token);

  return data;
}

export async function signOut(): Promise<void> {
  try {
    await apiClient('/api/auth/sign_out', { method: 'DELETE' });
  } finally {
    removeToken();
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient<User>('/api/user');
  return data;
}

export async function updateCurrentUser(userData: UpdateUserData): Promise<User> {
  const { data } = await apiClient<User>('/api/user', {
    method: 'PATCH',
    body: JSON.stringify({ user: userData }),
  });
  return data;
}
