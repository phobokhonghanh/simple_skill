'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { getPlatformStyle } from '@/features/cashback/utils';

export interface FraudNoticeProps {
  platform?: string | null;
  className?: string;
}

/**
 * Reusable component rendering the platform rejection/fraud warning text.
 */
export function FraudNotice({ platform, className = '' }: FraudNoticeProps) {
  const t = useTranslations('cashback');
  const platformName = platform
    ? platform
    : t('common.platform_shopee');

  return (
    <span
      className={`text-[10px] text-neutral-400 dark:text-neutral-500 italic block whitespace-nowrap ${className}`}
    >
      {t.rich('labels.platform_rejected', {
        platformName,
        platform: (chunks) => (
          <span className={`font-bold ${getPlatformStyle(platform).color}`}>
            {chunks}
          </span>
        ),
      })}
    </span>
  );
}
