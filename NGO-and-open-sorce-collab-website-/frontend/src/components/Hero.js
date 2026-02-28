"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredUser } from '@/lib/auth';

export default function Hero() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getStoredUser());
    const handleAuthChange = () => setUser(getStoredUser());
    window.addEventListener('ngo-auth-change', handleAuthChange);
    return () => window.removeEventListener('ngo-auth-change', handleAuthChange);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent-200/20 blur-3xl" />

      <div className="container relative grid gap-12 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:py-28">
        {/* Copy */}
        <div className="space-y-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-100/60 px-4 py-1.5 text-xs font-semibold text-primary-700 ring-1 ring-primary-200">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
            Transparent contribution pipelines
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Coordinate NGO work
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {' '}without duplication.
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
            Surface active projects, track who is working on what, and reuse task
            templates so contributors can ship faster together.
          </p>

          <div className="flex flex-wrap gap-4">
            {user ? (
              <Link
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-7 py-3.5 font-semibold text-white shadow-glow transition-all duration-200 hover:from-primary-600 hover:to-primary-700"
                href="/dashboard"
              >
                Go to dashboard
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            ) : (
              <Link
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-7 py-3.5 font-semibold text-white shadow-glow transition-all duration-200 hover:from-primary-600 hover:to-primary-700"
                href="/auth/register"
              >
                Get started free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            )}
            <Link
              className="inline-flex items-center gap-2 rounded-xl border border-soft-200 bg-white px-7 py-3.5 font-semibold text-ink shadow-card transition-all duration-200 hover:border-primary-300 hover:bg-primary-50"
              href="/projects"
            >
              Explore projects
            </Link>
          </div>
        </div>

        {/* Illustrative cards */}
        <div className="hidden lg:block">
          <div className="relative space-y-5 animate-fade-in">
            {/* Pipeline card */}
            <div className="rounded-2xl border border-soft-200 bg-white/80 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Active pipeline</p>
                  <h3 className="text-base font-bold text-ink">Community Data Cleanup</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
                <span className="badge-open">4 tasks open</span>
                <span className="badge-assigned">2 contributors</span>
              </div>
            </div>

            {/* Template card */}
            <div className="ml-8 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Reusable template</p>
                  <h3 className="text-base font-bold text-ink">Rapid Assessment Kit</h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-muted">Clone tasks for new regions in minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
