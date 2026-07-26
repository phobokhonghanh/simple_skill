'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from '@/features/i18n/LanguageSwitcher';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

/** Danh sách các liên kết điều hướng trên thanh Navbar của trang Experience */
const NAV_LINK_KEYS = [
  { key: 'nav.home', href: '/' as const },
  { key: 'nav.experience', href: '/experience' as const },
  { key: 'nav.homelab', href: '#' },
] as const;

/**
 * Component NavBar hiển thị thanh điều hướng đầu trang cho phân hệ Experience.
 * Bao gồm các liên kết trang chính, bộ chuyển đổi ngôn ngữ (LanguageSwitcher) và bộ chuyển chủ đề giao diện (ThemeToggle).
 *
 * @returns JSX Element thanh điều hướng đầu trang.
 */
export function NavBar() {
  const t = useTranslations('experience');
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[var(--experience-nav-bg)] backdrop-blur-md border-b border-[var(--experience-nav-border)] shadow-sm">
      <nav className="container mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-6">
        {/* Danh sách liên kết trang chính ở bên trái */}
        <ul className="hidden sm:flex items-center gap-6">
          {NAV_LINK_KEYS.map(({ key, href }) => {
            const isDisabled = href === '#';
            const isActive = !isDisabled && pathname === href;

            if (isDisabled) {
              return (
                <li key={key}>
                  <span className="text-sm text-[var(--experience-subtle)] cursor-not-allowed font-medium">
                    {t(key)}
                  </span>
                </li>
              );
            }

            if (href.startsWith('#')) {
              return (
                <li key={key}>
                  <a
                    href={href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[var(--experience-accent)] font-semibold'
                        : 'text-[var(--experience-muted)] hover:text-[var(--experience-accent)]'
                    }`}
                  >
                    {t(key)}
                  </a>
                </li>
              );
            }

            return (
              <li key={key}>
                <Link
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[var(--experience-accent)] font-semibold'
                      : 'text-[var(--experience-muted)] hover:text-[var(--experience-accent)]'
                  }`}
                >
                  {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Nút chuyển ngôn ngữ và giao diện theme ở bên phải */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto sm:ml-0">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Nhãn hiển thị menu trên thiết bị di động */}
        <div className="sm:hidden">
          <span className="text-xs text-[var(--experience-subtle)]">Menu</span>
        </div>
      </nav>
    </header>
  );
}
