'use client';

import * as React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** Phân loại loại thông báo Toast */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';

/** Vị trí hiển thị danh sách Toast trên màn hình */
export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

/** Tùy chọn nâng cao cấu hình Toast */
export interface ToastOptions {
  /** Thời gian hiển thị (milisec, mặc định 4000ms) */
  duration?: number;
  /** Dòng mô tả chi tiết phụ */
  description?: string;
  /** Class CSS tùy chỉnh cho background */
  bgClass?: string;
  /** Class CSS tùy chỉnh cho văn bản */
  textClass?: string;
  /** Class CSS tùy chỉnh cho viền */
  borderClass?: string;
  /** Class CSS màu sắc biểu tượng */
  iconColorClass?: string;
  /** Class CSS cho thanh đếm ngược tiến độ */
  progressClass?: string;
  /** Class CSS bổ sung */
  className?: string;
  /** CSS inline tùy chỉnh */
  style?: React.CSSProperties;
  /** Icon tùy chỉnh thay thế icon mặc định */
  icon?: React.ReactNode;
}

/** Đơn vị thông báo Toast */
export interface Toast {
  /** Định danh duy nhất của Toast */
  id: string;
  /** Thông điệp chính */
  message: string;
  /** Phân loại thông báo */
  type: ToastType;
  /** Các tùy chọn cấu hình bổ sung */
  options?: ToastOptions;
}

/** Props cho ToastItem */
interface ToastItemProps {
  /** Thông tin thẻ Toast */
  toast: Toast;
  /** Vị trí hiển thị trên màn hình */
  position: ToastPosition;
  /** Hàm hủy/ẩn Toast */
  onDismiss: (id: string) => void;
}

/**
 * Component hiển thị một thẻ Toast thông báo đơn lẻ với hiệu ứng chuyển cảnh và thanh đếm ngược tự động tắt.
 *
 * @param props - ToastItemProps gồm thông tin toast, vị trí và hàm đóng onDismiss.
 * @returns JSX Element thẻ ToastItem.
 */
export function ToastItem({ toast, position, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);
  const { type, message, options = {} } = toast;
  const {
    duration = 4000,
    description,
    bgClass,
    textClass,
    borderClass,
    iconColorClass,
    progressClass,
    className,
    style,
    icon,
  } = options;

  const handleDismiss = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 150);
  }, [toast.id, onDismiss]);

  React.useEffect(() => {
    if (duration > 0 && duration !== Infinity) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleDismiss]);

  const defaultIcon = React.useMemo(() => {
    const iconSizeClass = 'h-5 w-5 shrink-0';
    switch (type) {
      case 'success':
        return (
          <CheckCircle2
            className={cn(iconSizeClass, iconColorClass || 'text-emerald-500')}
          />
        );
      case 'error':
        return (
          <AlertCircle
            className={cn(iconSizeClass, iconColorClass || 'text-rose-500')}
          />
        );
      case 'warning':
        return (
          <AlertTriangle
            className={cn(iconSizeClass, iconColorClass || 'text-amber-500')}
          />
        );
      case 'info':
      default:
        return (
          <Info
            className={cn(iconSizeClass, iconColorClass || 'text-sky-500')}
          />
        );
    }
  }, [type, iconColorClass]);

  const typeClasses = React.useMemo(() => {
    if (type === 'custom') {
      return {
        bg: bgClass || 'bg-background/90 dark:bg-zinc-900/90',
        text: textClass || 'text-foreground',
        border: borderClass || 'border-border',
        progress: progressClass || 'bg-primary',
      };
    }

    switch (type) {
      case 'success':
        return {
          bg:
            bgClass ||
            'bg-emerald-500/5 dark:bg-emerald-500/10 backdrop-blur-md',
          text: textClass || 'text-emerald-900 dark:text-emerald-200',
          border:
            borderClass || 'border-emerald-500/20 dark:border-emerald-500/30',
          progress: progressClass || 'bg-emerald-500',
        };
      case 'error':
        return {
          bg: bgClass || 'bg-rose-500/5 dark:bg-rose-500/10 backdrop-blur-md',
          text: textClass || 'text-rose-900 dark:text-rose-200',
          border: borderClass || 'border-rose-500/20 dark:border-rose-500/30',
          progress: progressClass || 'bg-rose-500',
        };
      case 'warning':
        return {
          bg: bgClass || 'bg-amber-500/5 dark:bg-amber-500/10 backdrop-blur-md',
          text: textClass || 'text-amber-900 dark:text-amber-200',
          border: borderClass || 'border-amber-500/20 dark:border-amber-500/30',
          progress: progressClass || 'bg-amber-500',
        };
      case 'info':
      default:
        return {
          bg: bgClass || 'bg-sky-500/5 dark:bg-sky-500/10 backdrop-blur-md',
          text: textClass || 'text-sky-900 dark:text-sky-200',
          border: borderClass || 'border-sky-500/20 dark:border-sky-500/30',
          progress: progressClass || 'bg-sky-500',
        };
    }
  }, [type, bgClass, textClass, borderClass, progressClass]);

  const animationClass = React.useMemo(() => {
    if (isExiting) return 'animate-toast-out';
    if (position.includes('right')) return 'animate-toast-in-right';
    if (position.includes('left')) return 'animate-toast-in-left';
    if (position.includes('top')) return 'animate-toast-in-top';
    return 'animate-toast-in-bottom';
  }, [isExiting, position]);

  return (
    <div
      role="alert"
      aria-live="polite"
      style={style}
      className={cn(
        'relative flex w-full max-w-sm gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all pointer-events-auto',
        typeClasses.bg,
        typeClasses.text,
        typeClasses.border,
        animationClass,
        className,
      )}
    >
      <div className="flex items-start justify-center">
        {icon || defaultIcon}
      </div>

      <div className="flex flex-1 flex-col gap-1 pr-4">
        <span className="text-sm font-semibold leading-tight">{message}</span>
        {description && (
          <span className="text-xs opacity-80 leading-normal">
            {description}
          </span>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
        aria-label="Đóng thông báo"
      >
        <X className="h-4 w-4" />
      </button>

      {duration > 0 && duration !== Infinity && !isExiting && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-[3px] w-full animate-toast-shrink',
            typeClasses.progress,
          )}
          style={{
            animationDuration: `${duration}ms`,
            opacity: 0.45,
          }}
        />
      )}
    </div>
  );
}

/** Props cho ToastContainer */
interface ToastContainerProps {
  /** Danh sách các Toast hiện có */
  toasts: Toast[];
  /** Vị trí định vị trên màn hình */
  position: ToastPosition;
  /** Hàm hủy ẩn Toast */
  onDismiss: (id: string) => void;
}

/**
 * Component chứa (Container) cố định danh sách các thẻ Toast ở góc màn hình.
 *
 * @param props - ToastContainerProps gồm toasts, position và onDismiss.
 * @returns JSX Element container chứa danh sách ToastItem.
 */
export function ToastContainer({
  toasts,
  position,
  onDismiss,
}: ToastContainerProps) {
  const positionClasses = React.useMemo(() => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4 items-start';
      case 'top-right':
        return 'top-4 right-4 items-end';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2 items-center';
      case 'bottom-left':
        return 'bottom-4 left-4 items-start';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2 items-center';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4 items-end';
    }
  }, [position]);

  return (
    <div
      className={cn(
        'fixed z-[100] flex w-full max-w-sm flex-col gap-2 pointer-events-none p-4 sm:max-w-md',
        positionClasses,
      )}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          position={position}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
