"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredToken } from '@/lib/auth';

export default function CtaBanner() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getStoredToken());
    const handler = () => setLoggedIn(!!getStoredToken());
    window.addEventListener('ngo-auth-change', handler);
    return () => window.removeEventListener('ngo-auth-change', handler);
  }, []);

  if (loggedIn) return null;

  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-8 py-16 text-center text-white sm:px-16">
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <h2 className="relative text-3xl font-extrabold sm:text-4xl">Ready to get started?</h2>
        <p className="relative mx-auto mt-4 max-w-lg text-primary-100">
          Join hundreds of NGOs and contributors collaborating transparently on things that matter.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-primary-600 shadow-lg transition-all duration-200 hover:bg-primary-50"
            href="/auth/register"
          >
            Create free account
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-white/10"
            href="/projects"
          >
            Explore projects
          </Link>
        </div>
      </div>
    </section>
  );
}
