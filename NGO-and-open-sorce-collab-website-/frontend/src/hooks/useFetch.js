"use client";

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

/**
 * Generic data-fetching hook with loading / error states and refetch.
 * @param {string} path  — API path, e.g. '/api/projects'
 * @param {{ skip?: boolean }} options
 */
export function useFetch(path, { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState('');

  const fetchData = useCallback(() => {
    if (!path) return;
    setLoading(true);
    setError('');
    apiFetch(path)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => {
    if (!skip) fetchData();
  }, [fetchData, skip]);

  return { data, loading, error, refetch: fetchData };
}
