"use client";

import { useEffect, useState, useCallback } from 'react';
import { getStoredToken, getStoredUser, clearStoredAuth } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

/**
 * Central auth hook — provides user state, logout, loading, and hydration safety.
 * @param {{ redirectTo?: string, requireAuth?: boolean }} options
 */
export function useAuth({ redirectTo, requireAuth = false } = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cached = getStoredUser();
    const token = getStoredToken();

    if (!token) {
      setLoading(false);
      if (requireAuth && redirectTo) router.push(redirectTo);
      return;
    }

    if (cached) setUser(cached);

    apiFetch('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(cached || null))
      .finally(() => setLoading(false));

    const handleAuthChange = () => setUser(getStoredUser());
    window.addEventListener('ngo-auth-change', handleAuthChange);
    return () => window.removeEventListener('ngo-auth-change', handleAuthChange);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      clearStoredAuth();
      setUser(null);
      router.push('/');
    }
  }, [router]);

  return { user, loading, logout, isNGO: user?.role === 'NGO' };
}
