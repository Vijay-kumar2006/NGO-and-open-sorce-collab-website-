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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'NGO' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (data?.token) setStoredAuth(data.token, data.user);
      setStatus({ type: 'success', message: 'Account created. Redirecting...' });
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
          <div className="rounded-2xl border border-soft-200 bg-white p-8 shadow-card animate-fade-in-up sm:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-accent-500 shadow-glow">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-ink">Create your account</h1>
              <p className="mt-1 text-sm text-ink-muted">Start collaborating on transparent pipelines.</p>
            </div>

            <Alert type={status.type} message={status.message} onDismiss={() => setStatus({ type: '', message: '' })} />

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Full name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
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

              <label className="block space-y-1.5 text-sm font-medium text-ink-light">
                <span>Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-soft-200 bg-white px-4 py-2.5 text-ink shadow-sm transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="NGO">NGO</option>
                  <option value="CONTRIBUTOR">Contributor</option>
                </select>
              </label>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              Already have an account?{' '}
              <Link className="font-semibold text-primary-500 hover:text-primary-700 transition-colors" href="/auth/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
