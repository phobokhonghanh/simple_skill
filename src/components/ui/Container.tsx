'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

/** Props cho Container quản lý trạng thái tải/lỗi/rỗng */
export interface ContainerProps {
  /** Trạng thái đang tải dữ liệu */
  loading: boolean;
  /** UI tùy chỉnh khi đang tải */
  loadingFallback?: React.ReactNode;
  /** Thông báo lỗi khi có sự cố */
  error?: string | null;
  /** UI tùy chỉnh khi gặp lỗi */
  errorFallback?: React.ReactNode;
  /** Dữ liệu có rỗng hay không */
  isEmpty?: boolean;
  /** UI tùy chỉnh khi dữ liệu rỗng */
  emptyFallback?: React.ReactNode;
  /** Thông điệp hiển thị khi dữ liệu rỗng */
  emptyMessage?: string;
  /** Class CSS bổ sung */
  className?: string;
  /** Nội dung dữ liệu hiển thị chính */
  children: React.ReactNode;
}

/**
 * Component Container bọc quản lý các trạng thái dữ liệu (Loading, Error, Empty và Success).
 * Tự động điều hướng hiển thị Spinner khi Loading, Thẻ báo lỗi khi Error, hoặc Thẻ báo rỗng khi Empty.
 *
 * @param props - ContainerProps gồm loading, error, isEmpty, các fallback UI và children.
 * @returns JSX Element tương ứng với trạng thái dữ liệu hiện tại.
 */
export function Container({
  loading,
  loadingFallback,
  error,
  errorFallback,
  isEmpty = false,
  emptyFallback,
  emptyMessage,
  className = '',
  children,
}: ContainerProps) {
  const tCommon = useTranslations('common');

  if (loading) {
    if (loadingFallback) return <>{loadingFallback}</>;
    return (
      <div
        className={`py-8 flex flex-col items-center justify-center gap-2 ${className}`}
      >
        <Loader2 className="w-6 h-6 text-[var(--aff-orange)] animate-spin" />
        <span className="text-xs text-[var(--aff-muted)]">
          {tCommon('labels.loading')}
        </span>
      </div>
    );
  }

  if (error) {
    if (errorFallback) return <>{errorFallback}</>;
    return (
      <div
        className={`p-4 text-center text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl my-2 ${className}`}
      >
        {error}
      </div>
    );
  }

  if (isEmpty) {
    if (emptyFallback) return <>{emptyFallback}</>;
    return (
      <div
        className={`p-6 text-center text-xs text-[var(--aff-muted)] my-2 ${className}`}
      >
        {emptyMessage || tCommon('errors.not_found')}
      </div>
    );
  }

  return <>{children}</>;
}
