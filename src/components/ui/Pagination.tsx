'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PaginationProps {
  /** Trang hiện tại (1-indexed) */
  currentPage?: number;
  page?: number;
  /** Tổng số trang */
  totalPages: number;
  /** Tổng số bản ghi/dòng dữ liệu (tùy chọn) */
  totalRecords?: number;
  /** Callback được gọi khi chuyển trang */
  onPageChange: (page: number) => void;
  loading?: boolean;
  /** Class CSS bổ sung */
  className?: string;
}

/**
 * Component điều khiển Phân Trang (Pagination) chuẩn hóa dùng chung toàn bộ hệ thống.
 */
export function Pagination({
  currentPage,
  page,
  totalPages,
  totalRecords,
  onPageChange,
  loading = false,
  className = '',
}: PaginationProps) {
  const t = useTranslations('common');
  const activePage = currentPage ?? page ?? 1;

  if (totalPages <= 0) return null;

  return (
    <div
      className={`flex items-center justify-between border-0 pt-3 mt-4 ${className}`}
    >
      <span className="text-xs text-[var(--aff-muted)] font-medium">
        {totalRecords !== undefined
          ? t('pagination.total_records', { total: totalRecords })
          : t('pagination.page_indicator', { page: activePage, totalPages })}
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={activePage <= 1 || loading}
          onClick={() => onPageChange(Math.max(1, activePage - 1))}
          className="h-8 px-2.5 rounded-xl border border-[var(--aff-border)] text-xs text-[var(--aff-muted)] hover:text-[var(--aff-orange)] hover:border-orange-500/30 disabled:opacity-40 cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[var(--aff-muted)]" />
          <span className="hidden sm:inline">{t('buttons.previous')}</span>
        </Button>

        <span className="text-xs font-semibold px-2.5 py-1 text-[var(--aff-muted)]">
          {activePage} / {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={activePage >= totalPages || loading}
          onClick={() => onPageChange(Math.min(totalPages, activePage + 1))}
          className="h-8 px-2.5 rounded-xl border border-[var(--aff-border)] text-xs text-[var(--aff-muted)] hover:text-[var(--aff-orange)] hover:border-orange-500/30 disabled:opacity-40 cursor-pointer flex items-center gap-1"
        >
          <span className="hidden sm:inline">{t('buttons.next')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--aff-muted)]" />
        </Button>
      </div>
    </div>
  );
}
