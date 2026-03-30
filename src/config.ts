// In production, VITE_API_BASE_URL is empty so requests use relative paths (e.g. /api/...),
// which nginx proxies to the backend. In development, it points to the local Rails server.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
