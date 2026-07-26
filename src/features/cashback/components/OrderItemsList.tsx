'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShoppingBag } from 'lucide-react';
import { StatusBadge } from '@/features/cashback/components/StatusBadge';
import { FraudNotice } from '@/features/cashback/components/FraudNotice';
import { formatImageUrl, formatCurrency } from '@/features/cashback/utils';
import type { ConversionOrder, ConversionItem } from '@/features/cashback/types';

interface OrderItemsListProps {
  orders: ConversionOrder[];
  platform?: string;
  variant: 'desktop' | 'mobile';
}

interface OrderItemRowProps {
  item: ConversionItem;
  variant: 'desktop' | 'mobile';
  platform?: string;
}

function OrderItemRow({ item, variant, platform = 'shopee' }: OrderItemRowProps) {
  const t = useTranslations('cashback');

  const imgVal = item.product?.image || item.img_code;
  const nameVal = item.product?.name || item.item_name || '—';
  const shopVal = item.product?.shop || item.shop_name || '—';
  const commissionVal = item.product?.commission || item.item_commission;
  const isItemFraud = item.is_fraud === 1;
  const imageUrl = formatImageUrl(imgVal, platform);

  if (variant === 'desktop') {
    return (
      <div className="flex items-center justify-between gap-4 py-1 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 rounded-lg px-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded border border-[var(--aff-border)] bg-white flex-shrink-0 flex items-center justify-center overflow-hidden relative">
            {imgVal ? (
              <Image
                src={imageUrl}
                alt={nameVal}
                width={40}
                height={40}
                className="w-full h-full object-contain p-0.5"
                unoptimized
              />
            ) : (
              <ShoppingBag className="w-4 h-4 text-orange-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[var(--aff-heading)] line-clamp-1 break-all">
              {nameVal}
            </p>
            <span className="text-[10px] text-[var(--aff-muted)] block mt-0.5">
              {t('labels.qty_shop_prefix', {
                qty: item.qty ?? 0,
                shop: shopVal,
              })}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-semibold">
            {formatCurrency(item.actual_amount)}
          </p>
          <span className="text-[10px] text-amber-500 dark:text-amber-400 font-bold block mt-0.5">
            {formatCurrency(isItemFraud ? 0 : commissionVal, {
              showPlus: true,
            })}
          </span>
        </div>
      </div>
    );
  }

  // Mobile row
  return (
    <div className="flex gap-2 items-start justify-between min-w-0">
      <div className="flex gap-2 min-w-0 flex-1">
        <div className="w-7 h-7 rounded bg-white border border-[var(--aff-border)] flex-shrink-0 flex items-center justify-center overflow-hidden relative">
          {imgVal ? (
            <Image
              src={imageUrl}
              alt={nameVal}
              width={28}
              height={28}
              className="w-full h-full object-contain"
              unoptimized
            />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-3xs font-bold text-[var(--aff-heading)] line-clamp-1 break-words">
            {nameVal}
          </p>
          <span className="text-4xs text-[var(--aff-muted)] block mt-0.5">
            {t('labels.qty_prefix', { qty: item.qty ?? 0 })} •{' '}
            {formatCurrency(item.actual_amount)}
          </span>
        </div>
      </div>
      <span className="text-3xs font-bold text-amber-500 dark:text-amber-400 whitespace-nowrap flex-shrink-0">
        {formatCurrency(isItemFraud ? 0 : commissionVal, { showPlus: true })}
      </span>
    </div>
  );
}

export function OrderItemsList({
  orders,
  platform = 'shopee',
  variant,
}: OrderItemsListProps) {
  const t = useTranslations('cashback');

  if (variant === 'desktop') {
    return (
      <div className="space-y-3 pl-2">
        {orders.map((ord, oIdx) => {
          const orderIdVal = ord.id || ord.order_sn || ord.order_id;

          return (
            <div key={orderIdVal || oIdx} className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-semibold text-[var(--aff-muted)]">
                <span>
                  {t('labels.order_id_prefix', { id: orderIdVal || '' })}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1">
                {ord.items?.map((item, itemIdx) => (
                  <OrderItemRow key={itemIdx} item={item} variant="desktop" platform={platform} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Mobile variant
  return (
    <div className="pt-2 border-t border-dashed border-[var(--aff-border)] space-y-3 animate-in fade-in duration-200">
      {orders.map((ord, oIdx) => {
        const orderIdVal = ord.id || ord.order_sn || ord.order_id;
        const isOrderFraud =
          ord.items?.some((it) => it.is_fraud === 1) ?? false;
        const orderStatus = isOrderFraud ? 'rejected' : ord.order_status;

        return (
          <div key={orderIdVal || oIdx} className="space-y-2.5">
            <div className="flex justify-between items-center text-3xs font-mono text-[var(--aff-muted)] gap-2">
              <div className="flex flex-col text-left">
                <span className="truncate max-w-[140px]">
                  {t('labels.order_id')}: {orderIdVal || '—'}
                </span>
                {isOrderFraud && (
                  <FraudNotice platform={platform} className="mt-0.5" />
                )}
              </div>
              <StatusBadge status={orderStatus} />
            </div>
            <div className="space-y-3">
              {ord.items?.map((item, itemIdx) => (
                <OrderItemRow key={itemIdx} item={item} variant="mobile" platform={platform} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
