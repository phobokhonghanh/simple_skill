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

  const { checkoutId, orderSn, purchaseDateStr, platform, orders, utmContent } = summary;

  return (
    <div
      className={`bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 rounded-md p-3 sm:p-3.5 shadow-xs space-y-2 text-left max-w-full overflow-hidden ${className}`}
    >
      {/* Row 1: Platform (Left), Status + Fraud Notice directly under status (Right) */}
      <div className="flex justify-between items-start gap-2 max-w-full overflow-hidden">
        <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-transparent border-0 shrink-0 mt-0.5">
          {platform}
        </span>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <StatusBadge status={summary.displayStatus} />
          {summary.hasFraud && <FraudNotice platform={platform} className="mt-0.5" />}
        </div>
      </div>

      {/* Row 2: Thời gian */}
      <div className="flex items-center justify-between text-xs gap-2 pt-0.5 text-gray-500 dark:text-neutral-400 font-normal">
        <span className="shrink-0">
          {t('labels.purchase_time')}:
        </span>
        <span className="text-right truncate font-normal">
          {purchaseDateStr}
        </span>
      </div>

      {/* Row 3: Mã đơn hàng (ordersn) */}
      <div className="flex items-center justify-between text-xs gap-2 text-gray-500 dark:text-neutral-400 font-normal">
        <span className="shrink-0">
          {t('labels.order_id')}:
        </span>
        <span className="text-right truncate font-normal">
          {orderSn || checkoutId}
        </span>
      </div>

      {/* Row 4: Tổng tiền */}
      <div className="flex items-center justify-between text-xs gap-2 text-gray-500 dark:text-neutral-400 font-normal">
        <span className="shrink-0">
          {t('labels.total_order')}:
        </span>
        <span className="text-right font-normal">
          {formatCurrency(summary.totalAmount)}
        </span>
      </div>

      {/* Row 5: Hoàn tiền */}
      <div className="flex items-center justify-between text-xs gap-2 text-gray-500 dark:text-neutral-400 font-normal">
        <span className="shrink-0">
          {t('common.cashback')}:
        </span>
        <span className="text-right font-normal">
          {formatCurrency(summary.displayCashback, { showPlus: summary.displayCashback > 0 })}
        </span>
      </div>

      {/* Row 6: Toggle Button with border-t - ONLY shows count number e.g. Chi tiết (6) / Ẩn */}
      {onToggleExpand && (
        <div className="pt-2 mt-1 border-t border-gray-100 dark:border-neutral-800 text-center">
          <button
            type="button"
            onClick={onToggleExpand}
            className="w-full py-0.5 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer select-none border-0 bg-transparent shadow-none"
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
          </button>
        </div>
      )}

      {/* Expanded products list */}
      {isExpanded && orders && orders.length > 0 && (
        <OrderItemsList orders={orders} platform={platform} checkoutId={checkoutId} variant="mobile" />
      )}
    </div>
  );
}
