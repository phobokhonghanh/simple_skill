'use client';

import * as React from 'react';
import { ArrowLeft, Share2, LogOut, User as UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from '@/features/i18n/LanguageSwitcher';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

import type { User } from '@/features/cashback/types';

interface NavBarProps {
  user?: User | null;
  handleLogout?: () => void;
  onLoginClick?: () => void;
}

/**
 * NavBar for Affiliate page.
 * Styled with warm orange borders, logo and integration with Lang/Theme toggles.
 */
export function NavBar({ user, handleLogout, onLoginClick }: NavBarProps = {}) {
  const t = useTranslations('cashback');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--aff-nav-bg)] backdrop-blur-md border-b border-[var(--aff-border)] transition-colors duration-300">
      <nav className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo and Back link */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--aff-border)] hover:border-orange-500/30 hover:bg-orange-500/5 transition-all text-[var(--aff-text)] hover:text-[var(--aff-orange)] active:scale-95 cursor-pointer"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>

          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/10">
              <Share2 className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden xs:block">
              <span className="text-[var(--aff-text)]">Portal</span>
              <span className="text-[var(--aff-orange)] ml-1">Cashback</span>
            </span>
          </div>
        </div>

        {/* Right: Language Switcher, Theme Toggle, and Google Login / Profile */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          {mounted && (
            <>
              {!user ? (
                <button
                  onClick={onLoginClick}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-[var(--aff-border)] bg-background text-[var(--aff-text)] hover:bg-[var(--aff-border)] active:scale-95 transition-all cursor-pointer flex items-center gap-2 ml-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>{t('login_btn')}</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 pl-3 border-l border-[var(--aff-border)] ml-2">
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.picture}
                      alt={user.name || 'User'}
                      className="w-9 h-9 rounded-full border border-orange-500/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center text-[var(--aff-orange)]">
                      <UserIcon className="w-4.5 h-4.5" />
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[var(--aff-text)] truncate max-w-[120px]">
                        {user.name || user.email}
                      </span>
                      {user.role === 'admin' ? (
                        <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-500/25 uppercase tracking-wider">
                          {t('admin_role')}
                        </span>
                      ) : (
                        <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-orange-500/25 uppercase tracking-wider">
                          {t('user_role')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--aff-muted)] block truncate max-w-[150px]">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('logout_btn')}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
