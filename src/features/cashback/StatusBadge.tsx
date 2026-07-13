import * as React from 'react';

export interface StatusBadgeProps {
  status?: string | null;
}

export const getStatusDetails = (status?: string | null) => {
  if (!status) return null;
  const lower = status.toLowerCase();

  // Completed (Xanh lá đậm)
  if (lower === 'completed') {
    return {
      className:
        'bg-green-700/15 text-green-700 dark:text-green-400 border-green-700/30',
    };
  }
  // Approved (Xanh lá nhạt)
  if (lower === 'approved') {
    return {
      className:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  }
  // Pending (Màu vàng)
  if (lower === 'pending') {
    return {
      className:
        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    };
  }
  // Cancelled (Màu xám)
  if (lower === 'cancelled') {
    return {
      className:
        'bg-neutral-500/10 text-neutral-500 dark:text-neutral-400 border-neutral-500/20',
    };
  }

  return {
    className:
      'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  };
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;
  const details = getStatusDetails(status);
  const className =
    details?.className ??
    'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${className}`}
    >
      {status}
    </span>
  );
}
