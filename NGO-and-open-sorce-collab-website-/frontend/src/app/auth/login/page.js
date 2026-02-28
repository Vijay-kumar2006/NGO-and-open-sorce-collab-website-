"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import { apiFetch } from '@/lib/api';
import { setStoredAuth } from '@/lib/auth';
import PageTransition from '@/components/PageTransition';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (data?.token) setStoredAuth(data.token, data.user);
      setStatus({ type: 'success', message: 'Logged in successfully.' });
      router.push('/dashboard');
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-soft-200 bg-white p-8 shadow-card animate-fade-in-up sm:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
              <p className="mt-1 text-sm text-ink-muted">Sign in to manage your NGO pipelines.</p>
            </div>

            <Alert type={status.type} message={status.message} onDismiss={() => setStatus({ type: '', message: '' })} />

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                placeholder="you@organisation.org"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              New here?{' '}
              <Link className="font-semibold text-primary-500 hover:text-primary-700 transition-colors" href="/auth/register">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
