'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateInput } from './DateInput';

export interface FilterBarProps {
  startDate?: string;
  onStartDateChange?: (val: string) => void;
  endDate?: string;
  onEndDateChange?: (val: string) => void;
  subId?: string;
  onSubIdChange?: (val: string) => void;
  subIdPlaceholder?: string;
  userId?: string;
  onUserIdChange?: (val: string) => void;
  userIdPlaceholder?: string;
  onSearch: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * Component FilterBar tái sử dụng cho các màn hình Admin & Orders.
 * Bọc các trường nhập liệu trong thẻ <form> hỗ trợ phím Enter để submit tìm kiếm.
 */
export function FilterBar({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  subId,
  onSubIdChange,
  subIdPlaceholder,
  userId,
  onUserIdChange,
  userIdPlaceholder,
  onSearch,
  loading = false,
  className = '',
}: FilterBarProps) {
  const t = useTranslations('cashback');
  const tCommon = useTranslations('common');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-3 ${className}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end text-left">
        {onStartDateChange && (
          <DateInput
            label={t('common.from_date')}
            value={startDate || ''}
            onChange={onStartDateChange}
            className="w-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm"
          />
        )}

        {onEndDateChange && (
          <DateInput
            label={t('common.to_date')}
            value={endDate || ''}
            onChange={onEndDateChange}
            className="w-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm"
          />
        )}

        {onSubIdChange && (
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 dark:text-neutral-400">
              {t('common.sub_id')}
            </label>
            <input
              type="text"
              placeholder={subIdPlaceholder || t('filters.sub_id_placeholder')}
              value={subId || ''}
              onChange={(e) => onSubIdChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-xs sm:text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-xs h-9"
            />
          </div>
        )}

        {onUserIdChange && (
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 dark:text-neutral-400">
              {t('labels.user_id')}
            </label>
            <input
              type="text"
              placeholder={userIdPlaceholder || t('filters.search_user_id')}
              value={userId || ''}
              onChange={(e) => onUserIdChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-xs sm:text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-xs h-9"
            />
          </div>
        )}

        <div className="col-span-2 sm:col-span-1">
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-1.5 px-4 rounded-md text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 font-bold w-full h-9 disabled:opacity-50 transition-colors border-0 shadow-xs"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{tCommon('buttons.search')}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
