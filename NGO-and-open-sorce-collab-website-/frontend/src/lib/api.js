import { getStoredToken } from './auth';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function apiFetch(path, options = {}) {
  const token = getStoredToken();
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    credentials: 'include',
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}
