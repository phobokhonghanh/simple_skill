'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  CASHBACK_STATUSES,
  KNOWN_STATUS_VALUES,
} from '@/features/cashback/config';

export interface StatusBadgeProps {
  status?: string | null;
}

export const getStatusDetails = (status?: string | null) => {
  if (!status) return null;
  const lower = status.toLowerCase();

  // Completed & Approved (Xanh lá tích cực - Emerald)
  if (
    lower === CASHBACK_STATUSES.COMPLETED ||
    lower === CASHBACK_STATUSES.APPROVED
  ) {
    return {
      className:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold',
    };
  }
  // Pending (Màu vàng chờ xử lý)
  if (lower === CASHBACK_STATUSES.PENDING) {
    return {
      className:
        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 font-bold',
    };
  }
  // Cancelled or Rejected (Màu đỏ thất bại/từ chối)
  if (
    lower === CASHBACK_STATUSES.CANCELLED ||
    lower === CASHBACK_STATUSES.REJECTED
  ) {
    return {
      className:
        'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 font-bold',
    };
  }

  return {
    className:
      'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 font-bold',
  };
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations('cashback');

  if (!status) return null;
  const lowerStatus = status.toLowerCase();
  const details = getStatusDetails(lowerStatus);
  const className =
    details?.className ??
    'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';

  let displayLabel: string;
  if (KNOWN_STATUS_VALUES.includes(lowerStatus)) {
    displayLabel = t(`status.${lowerStatus}`);
  } else {
    displayLabel =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider border ${className}`}
    >
      {displayLabel}
    </span>
  );
}
