'use client';

import * as React from 'react';

export interface LoadingProps {
  variant?: 'detailed' | 'compact';
  className?: string;
}

/**
 * Component hiển thị Skeleton Loading State cho sản phẩm (hỗ trợ cả dạng detailed và compact).
 */
export function Loading({
  variant = 'detailed',
  className = '',
}: LoadingProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`p-3 rounded-xl border border-[var(--aff-border)] flex gap-3 animate-pulse ${className}`}
      >
        <div className="w-12 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-800/60 flex-shrink-0" />
        <div className="flex-1 space-y-2 py-0.5 text-left">
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-3/4" />
          <div className="flex justify-between items-center pt-1">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-16" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800/60 rounded-full w-14" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-none space-y-5 animate-pulse ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-32 h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800/60 flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1 text-left">
          <div className="h-4.5 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-3/4" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-1/2" />
          <div className="flex gap-2 pt-2">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800/60 rounded-full w-20" />
            <div className="h-5 bg-neutral-200 dark:bg-neutral-800/60 rounded-full w-16" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--aff-border)]">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-10" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-24" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-10" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-24" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--aff-border)]">
        <div className="h-11 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl w-full" />
        <div className="h-11 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl w-full" />
      </div>
    </div>
  );
}
