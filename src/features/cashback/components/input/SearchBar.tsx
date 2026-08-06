'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Search, Clipboard, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SearchBarProps {
  onSearch: (value: string) => void;
  loading?: boolean;
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  loading = false,
  initialValue = '',
  placeholder,
  className = '',
}: SearchBarProps) {
  const t = useTranslations('cashback');
  const tCommon = useTranslations('common');
  const [value, setValue] = React.useState(initialValue);

  const handleClear = () => {
    setValue('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setValue(text);
      }
    } catch {
      // Fallback if clipboard API is unavailable/restricted
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSearch(trimmed);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <LinkIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none z-10" />
            <input
              type="text"
              className="w-full pl-11 sm:pl-12 pr-28 py-2.5 sm:py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-xs sm:text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-xs h-10 sm:h-11"
              placeholder={placeholder || t('input.placeholder')}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {value ? (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer select-none"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-600 dark:text-neutral-300 transition-colors text-[11px] sm:text-xs font-semibold cursor-pointer select-none border border-gray-200/80 dark:border-neutral-700"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>{t('buttons.paste')}</span>
                </button>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-6 rounded-md bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer select-none disabled:opacity-50 transition-colors border-0 shrink-0"
            disabled={Boolean(loading || !value.trim())}
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{tCommon('buttons.search')}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
