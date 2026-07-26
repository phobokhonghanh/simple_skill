'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Search, Clipboard, X } from 'lucide-react';
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
    <div className={`aff-card p-5 sm:p-6 rounded-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              className="aff-input w-full pl-4 pr-24 py-3 rounded-xl text-sm sm:text-base"
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
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer select-none"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  disabled={loading}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors text-xs font-semibold cursor-pointer select-none bg-gray-100/50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>{t('buttons.paste')}</span>
                </button>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="aff-btn-primary h-auto py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-sm sm:text-base cursor-pointer select-none disabled:opacity-50"
            disabled={Boolean(loading || !value.trim())}
          >
            <Search className="w-5 h-5" />
            <span>{tCommon('buttons.search')}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
