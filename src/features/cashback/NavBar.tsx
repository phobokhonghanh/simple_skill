'use client';

import * as React from 'react';
import Image from 'next/image';
import { LogOut, User as UserIcon, CreditCard, ChevronDown } from 'lucide-react';
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

function GoogleIcon({
  className = 'w-3.5 h-3.5 flex-shrink-0',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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
  );
}

/**
 * NavBar for Cashback module with dropdown user menu.
 */
export function NavBar({ user, handleLogout, onLoginClick }: NavBarProps = {}) {
  const tAuth = useTranslations('auth');
  const emptySubscribe = React.useCallback(() => () => {}, []);
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--aff-nav-bg)] backdrop-blur-md border-b border-[var(--aff-border)] transition-colors duration-300">
      <nav className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Clean space without logo & back icon */}
        <div className="flex items-center gap-3"></div>

        {/* Right: Language Switcher, Theme Toggle, and User Profile Dropdown */}
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
                  <GoogleIcon />
                  <span>{tAuth('buttons.login')}</span>
                </button>
              ) : (
                <div
                  className="relative ml-2 pl-3 border-l border-[var(--aff-border)]"
                  ref={dropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-orange-500/5 transition-all cursor-pointer select-none"
                    aria-expanded={dropdownOpen}
                  >
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || 'User'}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full border border-orange-500/30 object-cover"
                        unoptimized
                        priority
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
                            {tAuth('roles.admin')}
                          </span>
                        ) : (
                          <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-orange-500/25 uppercase tracking-wider">
                            {tAuth('roles.user')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--aff-muted)] block truncate max-w-[150px]">
                        {user.email}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--aff-muted)] transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-background border border-[var(--aff-border)] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 slide-in-from-top-2">
                      <Link
                        href="/cashback/payment-setting"
                        target="_blank"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[var(--aff-text)] hover:bg-orange-500/10 hover:text-[var(--aff-orange)] transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-[var(--aff-orange)]" />
                        <span>{tAuth('buttons.payment_setting')}</span>
                      </Link>

                      <div className="my-1 border-t border-[var(--aff-border)]" />

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout?.();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{tAuth('buttons.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
