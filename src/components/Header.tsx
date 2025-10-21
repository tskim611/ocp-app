'use client';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace current locale in pathname with new locale
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
      <button
        onClick={() => switchLocale('ko')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
          locale === 'ko'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
          locale === 'en'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        English
      </button>
    </div>
  );
};

export default function Header() {
  const t = useTranslations('nav');
  const { user, loading } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            OCP App
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/tools/calculator"
                  className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('calculator')}
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('guides')}
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('community')}
                </Link>
              </li>
            </ul>

            {/* Language Switcher */}
            <LocaleSwitcher />

            {/* Auth Section */}
            {!loading && (
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                        {user.email}
                      </span>
                    </div>
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <svg
                            className="animate-spin h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="hidden sm:inline">Signing out...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="hidden sm:inline">{t('signOut')}</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login/Signup Links */}
                    <Link
                      href="/login"
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {t('signIn')}
                    </Link>
                    <Link
                      href="/signup"
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                    >
                      {t('signUp')}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="flex md:hidden items-center gap-3">
            <LocaleSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tools/calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                >
                  {t('calculator')}
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                >
                  {t('guides')}
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                >
                  {t('community')}
                </Link>
              </li>
            </ul>

            {/* Mobile Auth Section */}
            {!loading && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('signOut')}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t('signIn')}
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                    >
                      {t('signUp')}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
