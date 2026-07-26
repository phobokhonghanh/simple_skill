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
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end text-left ${className}`}
    >
      {onStartDateChange && (
        <DateInput
          label={t('common.from_date')}
          value={startDate || ''}
          onChange={onStartDateChange}
          className="w-full px-3 py-1.5 text-xs"
        />
      )}

      {onEndDateChange && (
        <DateInput
          label={t('common.to_date')}
          value={endDate || ''}
          onChange={onEndDateChange}
          className="w-full px-3 py-1.5 text-xs"
        />
      )}

      {onSubIdChange && (
        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-[var(--aff-muted)]">
            {t('common.sub_id')}
          </label>
          <input
            type="text"
            placeholder={subIdPlaceholder || t('filters.sub_id_placeholder')}
            value={subId || ''}
            onChange={(e) => onSubIdChange(e.target.value)}
            className="aff-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
      )}

      {onUserIdChange && (
        <div className="space-y-1.5 flex-1 w-full">
          <label className="text-2xs font-bold text-[var(--aff-muted)]">
            {t('labels.user_id')}
          </label>
          <input
            type="text"
            placeholder={userIdPlaceholder || t('filters.search_user_id')}
            value={userId || ''}
            onChange={(e) => onUserIdChange(e.target.value)}
            className="aff-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={loading}
          className="aff-btn-primary py-1.5 px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1 font-bold w-full h-[34px] disabled:opacity-50"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{tCommon('buttons.search')}</span>
        </Button>
      </div>
    </form>
  );
}
