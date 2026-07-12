'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/features/cashback/StatusBadge';
import { formatShopeeImageUrl, formatPrice, formatDate } from '@/features/cashback/utils';
import type { ConversionOrder } from '@/features/cashback/types';

interface CashbackCardProps {
  checkoutId: string;
  purchaseTime: number | null;
  status: string;
  totalAmount: number;
  cashback: number;
  orders?: ConversionOrder[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  className?: string;
}

export function CashbackCard({
  checkoutId,
  purchaseTime,
  status,
  totalAmount,
  cashback,
  orders,
  isExpanded,
  onToggleExpand,
  className = '',
}: CashbackCardProps) {
  const t = useTranslations('cashback');
  const purchaseDateStr = formatDate(purchaseTime);
  const totalItems = orders?.reduce((acc, o) => acc + (o.items?.length || 0), 0) || 0;

  return (
    <div
      className={`aff-card p-4 rounded-xl border border-[var(--aff-border)] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3 text-left max-w-full overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ${className}`}
    >
      <div className="flex justify-between items-start gap-2 max-w-full overflow-hidden">
        <div className="min-w-0 flex-1">
          <p className="text-2xs font-mono text-[var(--aff-muted)] truncate max-w-[150px] break-all">
            ID: {checkoutId}
          </p>
          <p className="text-3xs text-[var(--aff-muted)] mt-0.5">{purchaseDateStr}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--aff-border)] text-xs">
        <div>
          <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
            {t('amount')}
          </span>
          <p className="font-bold text-[var(--aff-text)] mt-0.5">{formatPrice(totalAmount)}</p>
        </div>
        <div className="text-right">
          <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
            {t('commission')}
          </span>
          <p className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            +{formatPrice(cashback)}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onToggleExpand}
        className="w-full h-auto py-1.5 border border-[var(--aff-border)] rounded-lg text-3xs font-bold text-[var(--aff-muted)] flex items-center justify-center gap-1 cursor-pointer active:bg-orange-500/5 hover:text-orange-500 hover:border-orange-500/20 hover:bg-transparent"
      >
        <span>
          {isExpanded
            ? t('hide_details')
            : t('show_details', { count: totalItems })}
        </span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </Button>

      {/* Expanded products lists */}
      {isExpanded && orders && orders.length > 0 && (
        <div className="pt-2 border-t border-dashed border-[var(--aff-border)] space-y-3 animate-in fade-in duration-200">
          {orders.map((ord, oIdx) => {
            const orderIdVal = ord.id || ord.order_sn || ord.order_id;
            return (
              <div key={orderIdVal || oIdx} className="space-y-2.5">
                <div className="flex justify-between items-center text-3xs font-mono text-[var(--aff-muted)] gap-2">
                  <span className="truncate max-w-[140px]">{t('order_id')}: {orderIdVal || '—'}</span>
                  <StatusBadge status={ord.order_status} />
                </div>
                <div className="space-y-3">
                  {ord.items?.map((it, itemIdx) => {
                    const imgVal = it.product?.image || it.img_code;
                    const nameVal = it.product?.name || it.item_name;
                    const commissionVal = it.product?.commission || it.item_commission;
                    return (
                      <div key={itemIdx} className="flex gap-2 items-start justify-between min-w-0">
                        <div className="flex gap-2 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded bg-white border border-[var(--aff-border)] flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {imgVal ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={formatShopeeImageUrl(imgVal)}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-3xs font-bold text-[var(--aff-heading)] line-clamp-1 break-words">
                              {nameVal || '—'}
                            </p>
                            <span className="text-4xs text-[var(--aff-muted)] block mt-0.5">
                              {t('qty_prefix', { qty: it.qty ?? 0 })} • {formatPrice(it.actual_amount)}
                            </span>
                          </div>
                        </div>
                        <span className="text-3xs font-bold text-orange-600 whitespace-nowrap flex-shrink-0">
                          +{formatPrice(commissionVal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
