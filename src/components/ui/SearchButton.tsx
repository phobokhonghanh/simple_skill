'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Props cho Component Nút Tìm kiếm (SearchButton) */
export interface SearchButtonProps {
  /** Callback sự kiện click nút */
  onClick?: () => void;
  /** Loại nút bấm HTML ('button' | 'submit' | 'reset') */
  type?: 'button' | 'submit' | 'reset';
  /** Trạng thái vô hiệu hóa */
  disabled?: boolean;
  /** Trạng thái đang tải dữ liệu/tìm kiếm */
  loading?: boolean;
  /** Class CSS tùy chỉnh bổ sung */
  className?: string;
  /** Nhãn văn bản tùy chỉnh (mặc định lấy từ i18n common.buttons.search) */
  label?: string;
}

/**
 * Nút Tìm kiếm (SearchButton) chuẩn hóa dùng chung hỗ trợ hiệu ứng xoay spinner khi đang tải.
 *
 * @param props - SearchButtonProps gồm onClick, type, disabled, loading, className và label.
 * @returns JSX Element nút Tìm kiếm.
 */
export function SearchButton({
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  label,
}: SearchButtonProps) {
  const tCommon = useTranslations('common');

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`aff-btn-primary h-[34px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs cursor-pointer select-none disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Search className="w-3.5 h-3.5" />
      )}
      <span>{label || tCommon('buttons.search')}</span>
    </Button>
  );
}
