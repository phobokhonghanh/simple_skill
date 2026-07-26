'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { CircleDollarSign, Sparkles } from 'lucide-react';
import { ClientWrapper } from '@/components/ui/ClientWrapper';

/**
 * Component hiển thị tab Rút tiền / Thanh toán của người dùng.
 * Hiện đang ở trạng thái phát triển (Coming Soon).
 */
export function PaymentTab() {
  const t = useTranslations('cashback');

  return (
    <ClientWrapper>
      <div className="space-y-6 max-w-full overflow-hidden text-center py-12 px-4 aff-card rounded-2xl flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 relative">
          <CircleDollarSign className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-black animate-pulse">
            !
          </div>
        </div>
        <h3 className="text-xl font-extrabold text-[var(--aff-heading)] mb-2">
          {t('tabs.payment')}
        </h3>
        <p className="text-sm text-[var(--aff-muted)] max-w-md mx-auto mb-6">
          {t('payment.coming_soon')}
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('payment.badge')}</span>
        </div>
      </div>
    </ClientWrapper>
  );
}
