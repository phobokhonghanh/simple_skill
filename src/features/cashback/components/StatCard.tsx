'use client';

import * as React from 'react';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  iconBgClass?: string;
  sparkline?: { strokePath: string; fillPath: string };
  className?: string;
}

/**
 * Component hiển thị thẻ thống kê tổng quan (dùng chung cho Orders, Admin, Dashboard...).
 * Đã loại bỏ animation Coin theo yêu cầu.
 */
export function StatCard({
  title,
  value,
  icon,
  iconBgClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  sparkline,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`relative bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 shadow-xs p-3 sm:p-5 rounded-md flex flex-col items-center justify-center text-center gap-2 sm:gap-3 overflow-hidden ${className}`}
    >
      <div
        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shrink-0 ${iconBgClass}`}
      >
        {icon}
      </div>
      <div className="space-y-0.5 sm:space-y-1 z-10">
        <span className="text-[11px] sm:text-sm font-medium text-gray-500 dark:text-neutral-400 block">
          {title}
        </span>
        <span className="text-xs sm:text-base font-bold block text-gray-900 dark:text-neutral-100">
          {value}
        </span>
      </div>

      {sparkline && (
        <div className="absolute bottom-0 left-0 right-0 w-full h-6 pointer-events-none">
          <svg
            viewBox="0 0 120 24"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="amber-wave-grad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--aff-orange)"
                  stopOpacity="0.12"
                />
                <stop
                  offset="100%"
                  stopColor="var(--aff-orange)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d={sparkline.strokePath}
              fill="none"
              stroke="var(--aff-orange)"
              strokeWidth="1.2"
              className="opacity-40 dark:opacity-30"
            />
            <path d={sparkline.fillPath} fill="url(#amber-wave-grad)" />
          </svg>
        </div>
      )}
    </div>
  );
}
