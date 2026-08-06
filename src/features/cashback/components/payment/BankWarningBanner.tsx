'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BankWarningBannerProps {
  onActionClick: () => void;
  className?: string;
}

export function BankWarningBanner({
  onActionClick,
  className = '',
}: BankWarningBannerProps) {
  const t = useTranslations('cashback.payment');

  return (
    <div
      className={`relative overflow-hidden p-4 sm:p-5 rounded-md bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border border-amber-500/30 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                <AlertTriangle className="w-3 h-3" />
                {t('warning_title')}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-neutral-100 leading-snug">
              {t('missing_bank_warning')}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onActionClick}
          className="aff-btn-primary shrink-0 w-full sm:w-auto h-9 px-4 rounded-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span>{t('configure_bank_now')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
