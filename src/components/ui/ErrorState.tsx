import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/** Props cho Component ErrorState */
export interface ErrorStateProps {
  /** Tiêu đề thông báo lỗi */
  title?: string;
  /** Nội dung mô tả chi tiết lỗi */
  message: string;
  /** Nhãn cho nút Thử lại */
  retryLabel?: string;
  /** Hàm callback khi click nút Thử lại */
  onRetry?: () => void;
  /** Class CSS bổ sung */
  className?: string;
}

/**
 * Component ErrorState hiển thị trạng thái lỗi chuẩn hóa.
 *
 * @param props - ErrorStateProps
 * @returns JSX Element của màn hình lỗi.
 */
export function ErrorState({
  title = 'Đã có lỗi xảy ra',
  message,
  retryLabel = 'Thử lại',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 sm:p-10 text-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive-foreground',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h4 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h4>

      <p className="mt-1 text-sm text-muted-foreground max-w-md">{message}</p>

      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
