'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/features/cashback/components/StatusBadge';
import { FraudNotice } from '@/features/cashback/components/FraudNotice';
import { OrderItemsList } from '@/features/cashback/components/OrderItemsList';
import {
  formatCurrency,
  extractCashbackSummary,
  type CashbackSummary,
} from '@/features/cashback/utils';
import type { CashbackRecord } from '@/features/cashback/types';

export interface CashbackCardProps {
  record: CashbackRecord;
  summary?: CashbackSummary;
  role?: 'user' | 'admin';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

/**
 * Component hiển thị thẻ đơn hàng dạng Mobile / Compact Card.
 * Hỗ trợ truyền trước `summary` từ parent để tránh tính toán lặp lại.
 */
export function CashbackCard({
  record,
  summary: externalSummary,
  role = 'user',
  isExpanded = false,
  onToggleExpand,
  className = '',
}: CashbackCardProps) {
  const t = useTranslations('cashback');
  const isAdmin = role === 'admin';

  const summary = React.useMemo(
    () => externalSummary ?? extractCashbackSummary(record),
    [record, externalSummary],
  );

  const { checkoutId, purchaseDateStr, platform, orders, utmContent } = summary;

  return (
    <div
      className={`aff-card p-4 rounded-xl border border-[var(--aff-border)] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3 text-left max-w-full overflow-hidden ${className}`}
    >
      <div className="flex justify-between items-start gap-2 max-w-full overflow-hidden">
        <div className="min-w-0 flex-1">
          <p className="text-2xs font-mono text-[var(--aff-muted)] truncate max-w-[150px] break-all">
            {t('labels.checkout_prefix', { id: checkoutId })}
          </p>
          <p className="text-3xs text-[var(--aff-muted)] mt-0.5">
            {purchaseDateStr}
          </p>
          {isAdmin && utmContent && (
            <p className="text-3xs font-mono text-[var(--aff-muted)] mt-0.5 truncate max-w-[180px] break-all">
              {t('common.sub_id')}: {utmContent}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={summary.displayStatus} />
          {summary.hasFraud && <FraudNotice platform={platform} />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--aff-border)] text-xs">
        <div>
          <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
            {t('common.amount')}
          </span>
          <p className="font-bold text-[var(--aff-text)] mt-0.5">
            {formatCurrency(summary.totalAmount)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
            {t('common.cashback')}
          </span>
          <p className="font-black text-amber-500 dark:text-amber-400 mt-0.5">
            {formatCurrency(summary.displayCashback, { showPlus: true })}
          </p>
        </div>
      </div>

      {onToggleExpand && (
        <Button
          variant="outline"
          onClick={onToggleExpand}
          className="w-full h-auto py-1.5 border border-[var(--aff-border)] rounded-lg text-3xs font-bold text-[var(--aff-muted)] flex items-center justify-center gap-1 cursor-pointer active:bg-orange-500/5 hover:text-orange-500 hover:border-orange-500/20 hover:bg-transparent"
        >
          <span>
            {isExpanded
              ? t('buttons.hide_details')
              : t('buttons.show_details', { count: summary.totalItems })}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </Button>
      )}

      {/* Expanded products lists */}
      {isExpanded && orders && orders.length > 0 && (
        <OrderItemsList orders={orders} platform={platform} variant="mobile" />
      )}
    </div>
  );
}
