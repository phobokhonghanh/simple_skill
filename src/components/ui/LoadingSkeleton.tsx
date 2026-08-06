import * as React from 'react';
import { cn } from '@/lib/utils';

/** Props cho Component LoadingSkeleton */
export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Chiều cao cố định hoặc class Tailwind */
  height?: string;
  /** Chiều rộng cố định hoặc class Tailwind */
  width?: string;
  /** Hình dạng skeleton ('rectangle' | 'circle' | 'card') */
  variant?: 'rectangle' | 'circle' | 'card';
}

/**
 * Component LoadingSkeleton hiển thị hiệu ứng khung xương tải dữ liệu bất đồng bộ.
 *
 * @param props - LoadingSkeletonProps
 * @returns JSX Element của Skeleton loader.
 */
export function LoadingSkeleton({
  className,
  height,
  width,
  variant = 'rectangle',
  style,
  ...props
}: LoadingSkeletonProps) {
  const variantStyles = {
    rectangle: 'rounded-md',
    circle: 'rounded-full',
    card: 'rounded-xl border border-border p-4 space-y-3',
  };

  if (variant === 'card') {
    return (
      <div
        className={cn('animate-pulse bg-card/50', variantStyles.card, className)}
        style={{ height, width, ...style }}
        {...props}
      >
        <div className="h-4 w-1/3 bg-muted rounded" />
        <div className="h-3 w-3/4 bg-muted/70 rounded" />
        <div className="h-3 w-1/2 bg-muted/50 rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-muted/80 dark:bg-muted/50',
        variantStyles[variant],
        className,
      )}
      style={{ height, width, ...style }}
      {...props}
    />
  );
}
