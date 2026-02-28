"use client";

import SectionHeader from '@/components/SectionHeader';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  return (
    <PageTransition>
      <div className="container max-w-2xl space-y-8 py-10">
        <SectionHeader title="Profile" subtitle="Manage your account details." />

        {loading ? (
          <LoadingSkeleton rows={1} />
        ) : user ? (
          <div className="card space-y-6 animate-fade-in-up">
            {/* Avatar + name */}
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-2xl font-bold text-white shadow-glow">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink">{user.name}</h3>
                <span className="badge-active mt-1">{user.role}</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-soft p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Email</p>
                <p className="mt-1 text-sm font-semibold text-ink">{user.email}</p>
              </div>
              <div className="rounded-xl bg-soft p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Role</p>
                <p className="mt-1 text-sm font-semibold text-ink">{user.role}</p>
              </div>
            </div>

            <div className="border-t border-soft-200 pt-4">
              <Button variant="danger" size="sm" onClick={logout}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="card text-sm text-ink-muted">
            <p>You are logged out. <a href="/auth/login" className="font-semibold text-primary-500 hover:underline">Sign in</a> to view your profile.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
