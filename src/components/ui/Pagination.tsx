'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Props cho Component Pagination */
export interface PaginationProps {
  /** Trang hiện tại (1-indexed) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Tổng số bản ghi/dòng dữ liệu */
  totalRecords: number;
  /** Callback được gọi khi chuyển trang */
  onPageChange: (page: number) => void;
  /** Class CSS bổ sung */
  className?: string;
}

/**
 * Component điều khiển Phân Trang (Pagination) chuẩn hóa dùng chung cho danh sách dữ liệu trong hệ thống.
 * Hiển thị tổng bản ghi, chỉ số trang hiện tại và các nút điều hướng Trang Trước/Trang Sau.
 *
 * @param props - PaginationProps gồm currentPage, totalPages, totalRecords, onPageChange và className.
 * @returns JSX Element bộ phân trang hoặc null nếu totalPages <= 0.
 */
export function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  className = '',
}: PaginationProps) {
  const t = useTranslations('common');

  if (totalPages <= 0) return null;

  return (
    <div
      className={`flex items-center justify-between border-t border-[var(--aff-border)] pt-4 mt-4 ${className}`}
    >
      <span className="text-2xs text-[var(--aff-muted)]">
        {t('pagination.total_records', { total: totalRecords })}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-2xs px-2 font-semibold">
          {t('pagination.page_indicator', {
            page: currentPage,
            totalPages,
          })}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
