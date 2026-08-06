'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';

/** Props cho Component ConfirmDialog */
export interface ConfirmDialogProps {
  /** Trạng thái mở modal */
  isOpen: boolean;
  /** Tiêu đề modal xác nhận */
  title: string;
  /** Mô tả chi tiết hành động */
  description: string;
  /** Nhãn nút đồng ý (mặc định: "Xác nhận") */
  confirmLabel?: string;
  /** Nhãn nút hủy (mặc định: "Hủy") */
  cancelLabel?: string;
  /** Biến thể nút xác nhận ('destructive' | 'default') */
  variant?: 'destructive' | 'default';
  /** Trạng thái đang tải dữ liệu */
  isLoading?: boolean;
  /** Hàm callback khi click xác nhận */
  onConfirm: () => void;
  /** Hàm callback khi đóng / hủy modal */
  onClose: () => void;
}

/**
 * Component ConfirmDialog chuẩn hóa hộp thoại xác nhận cho các hành động quan trọng/nguy hiểm.
 *
 * @param props - ConfirmDialogProps
 * @returns JSX Element của ConfirmDialog Modal.
 */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'destructive',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            variant === 'destructive'
              ? 'bg-destructive/10 text-destructive'
              : 'bg-primary/10 text-primary'
          }`}
        >
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-3 pt-4 border-t border-border mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant={variant}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
