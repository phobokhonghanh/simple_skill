'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Flag configurations for supported locales.
 */
const FLAGS = {
  en: {
    emoji: '🇬🇧',
    label: 'English',
  },
  vi: {
    emoji: '🇻🇳',
    label: 'Tiếng Việt',
  },
} as const;

/**
 * LanguageSwitcher molecule component.
 * Displays the current country flag and allows switching between locales.
 *
 * @example
 * <LanguageSwitcher />
 */
export function LanguageSwitcher() {
  const locale = useLocale() as keyof typeof FLAGS;
  const t = useTranslations('locales');
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: keyof typeof FLAGS) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full hover:bg-accent/50 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <span
            className="text-xl leading-none"
            role="img"
            aria-label={FLAGS[locale].label}
          >
            {FLAGS[locale].emoji}
          </span>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 p-1 animate-in slide-in-from-top-2 duration-200"
      >
        {(Object.keys(FLAGS) as Array<keyof typeof FLAGS>).map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleLocaleChange(key)}
            className="flex items-center gap-3 cursor-pointer py-2"
          >
            <span className="text-lg">{FLAGS[key].emoji}</span>
            <span
              className={
                locale === key ? 'font-bold text-primary' : 'text-foreground'
              }
            >
              {t(key)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
