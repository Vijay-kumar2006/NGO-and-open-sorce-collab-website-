"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { clearStoredAuth, getStoredToken, getStoredUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Button from './Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/templates', label: 'Templates' },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const cached = getStoredUser();
    if (cached) setUser(cached);

    const token = getStoredToken();
    if (token) {
      apiFetch('/api/auth/me')
        .then((data) => setUser(data.user))
        .catch(() => setUser(null));
    }

    const handleAuthChange = () => setUser(getStoredUser());
    window.addEventListener('ngo-auth-change', handleAuthChange);
    return () => window.removeEventListener('ngo-auth-change', handleAuthChange);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      clearStoredAuth();
      setUser(null);
      router.push('/');
    }
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-soft-200/80 bg-white/80 backdrop-blur-xl transition-colors">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center gap-2 text-lg font-bold text-ink transition-colors" href="/">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-black text-white">
            N
          </span>
          <span className="hidden sm:inline">NGO Pipeline Hub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-ink-muted hover:bg-soft-100 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-soft-100"
                href="/profile"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  {user.name}
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink-muted transition hover:bg-soft-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-soft-200 bg-white px-4 pb-4 pt-2 md:hidden animate-fade-in">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-ink-muted hover:bg-soft-100 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-soft-200 pt-3">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-soft-100"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  {user.name}
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth/login" className="block">
                <Button size="sm" className="w-full">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
