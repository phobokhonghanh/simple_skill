'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

/** Danh sách các liên kết mạng xã hội và email liên hệ ở Footer */
const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    href: 'https://github.com/phobokhonghanh',
    icon: <Github className="h-5 w-5" />,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/ndinhnguyende/',
    icon: <Linkedin className="h-5 w-5" />,
  },
  {
    name: 'Email',
    href: 'mailto:ndinhnguyen.work@gmail.com',
    icon: <Mail className="h-5 w-5" />,
  },
];

/** Năm bản quyền hiển thị */
const COPYRIGHT_YEAR = 2026;

/**
 * Component Footer chân trang dùng chung cho toàn bộ website.
 * Chứa danh sách các điều hướng trang chính (bookmarks, exp, cashback), các nút liên kết mạng xã hội và thông tin bản quyền.
 *
 * @returns JSX Element chân trang Footer.
 */
export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="w-full py-6 mt-auto border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4">
        {/* Khối điều hướng các liên kết trang chính */}
        <nav
          aria-label={t('footer.resources')}
          className="flex flex-col items-center gap-2"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('footer.resources')}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bookmarks">/bookmarks</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/experience">/exp</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cashback">/cashback</Link>
            </Button>
          </div>
        </nav>

        {/* Khối icon liên kết mạng xã hội */}
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
              >
                {link.icon}
                <span className="sr-only">{link.name}</span>
              </a>
            </Button>
          ))}
        </div>

        {/* Dòng bản quyền */}
        <p className="text-sm text-muted-foreground">
          © {COPYRIGHT_YEAR} Nguyen Dinh Nguyen
        </p>
      </div>
    </footer>
  );
}
