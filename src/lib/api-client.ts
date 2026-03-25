import { API_BASE_URL } from '../config.ts';
import { getToken, removeToken } from './token-storage.ts';

export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, errors: string[]) {
    super(errors[0] || 'An error occurred');
    this.status = status;
    this.errors = errors;
  }
}

interface ApiResponse<T> {
  data: T;
  headers: Headers;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
  }

  if (!response.ok) {
    let errors: string[];
    try {
      const body = await response.json();
      errors = body.errors || [body.error || response.statusText];
    } catch {
      errors = [response.statusText];
    }
    throw new ApiError(response.status, errors);
  }

  const contentType = response.headers.get('Content-Type');
  const data = contentType?.includes('application/json')
    ? await response.json()
    : (null as T);

  return { data, headers: response.headers };
}
