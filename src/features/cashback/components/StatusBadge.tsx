'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  CASHBACK_STATUSES,
  PAYMENT_STATUSES,
  KNOWN_STATUS_VALUES,
} from '@/features/cashback/config';

import { normalizeStatus } from '@/features/cashback/utils';

export interface StatusBadgeProps {
  status?: string | null;
  className?: string;
}

export const getStatusDetails = (status?: string | null) => {
  if (!status) return null;
  const lower = normalizeStatus(status).toLowerCase();

  // Completed & Approved (Xanh lá - Emerald)
  if (
    lower === CASHBACK_STATUSES.COMPLETED ||
    lower === CASHBACK_STATUSES.APPROVED ||
    lower === PAYMENT_STATUSES.COMPLETED.toLowerCase()
  ) {
    return {
      className:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold',
    };
  }
  // Pending & Waiting for payment (Màu cam/vàng)
  if (
    lower === CASHBACK_STATUSES.PENDING ||
    lower === CASHBACK_STATUSES.WAITING_FOR_PAYMENT ||
    lower === PAYMENT_STATUSES.PENDING.toLowerCase() ||
    lower === 'processing'
  ) {
    return {
      className:
        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold',
    };
  }
  // Cancelled or Rejected (Màu đỏ)
  if (
    lower === CASHBACK_STATUSES.CANCELLED ||
    lower === CASHBACK_STATUSES.REJECTED ||
    lower === PAYMENT_STATUSES.CANCELLED.toLowerCase()
  ) {
    return {
      className:
        'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold',
    };
  }

  return {
    className:
      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-semibold',
  };
};

export function StatusBadge({ status, className: extraClassName = '' }: StatusBadgeProps) {
  const t = useTranslations('cashback');

  if (!status) return null;
  const normalizedStatus = normalizeStatus(status);
  const lowerStatus = normalizedStatus.toLowerCase();
  const details = getStatusDetails(lowerStatus);
  const badgeClass =
    details?.className ??
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold';

  let displayLabel: string;
  if (KNOWN_STATUS_VALUES.includes(lowerStatus)) {
    displayLabel = t(`status.${lowerStatus}`);
  } else {
    displayLabel = normalizedStatus;
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold ${badgeClass} ${extraClassName}`}
    >
      {displayLabel}
    </span>
  );
}
