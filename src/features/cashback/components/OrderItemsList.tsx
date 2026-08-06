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
  checkoutId?: string;
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

  const actualCommission = isItemFraud ? 0 : (commissionVal ?? 0);

  if (variant === 'desktop') {
    return (
      <div className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-neutral-800/80 last:border-b-0 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/20 rounded-md px-2 min-w-0 text-left">
        {/* Product Image on left */}
        <div className="w-12 h-12 rounded-md border border-gray-200 dark:border-neutral-800 bg-white flex-shrink-0 flex items-center justify-center overflow-hidden relative mt-0.5">
          {imgVal ? (
            <Image
              src={imageUrl}
              alt={nameVal}
              width={48}
              height={48}
              className="w-full h-full object-contain p-0.5"
              unoptimized
            />
          ) : (
            <ShoppingBag className="w-4 h-4 text-orange-500" />
          )}
        </div>

        {/* Right side: 3 lines parallel to image */}
        <div className="min-w-0 flex-1 space-y-0.5 text-xs text-gray-500 dark:text-neutral-400 font-normal">
          {/* Line 1: Tên sản phẩm - 1 dòng duy nhất và ... nếu quá dài */}
          <p className="text-xs sm:text-sm font-normal text-gray-900 dark:text-neutral-100 truncate">
            {nameVal}
          </p>

          {/* Line 2: x1                          50.000đ */}
          <div className="flex items-center justify-between text-xs">
            <span>x{item.qty ?? 1}</span>
            <span>{formatCurrency(item.actual_amount)}</span>
          </div>

          {/* Line 3:                                10.000đ (Hoàn tiền) */}
          <div className="flex items-center justify-end text-xs">
            <span>{formatCurrency(actualCommission, { showPlus: actualCommission > 0 })}</span>
          </div>
        </div>
      </div>
    );
  }

  // Mobile row
  return (
    <div className="py-2 flex items-start gap-2.5 min-w-0 border-b border-gray-100 dark:border-neutral-800/80 last:border-b-0 text-left">
      {/* Product Image on left */}
      <div className="w-12 h-12 rounded-md bg-white border border-gray-200 dark:border-neutral-800 flex-shrink-0 flex items-center justify-center overflow-hidden relative mt-0.5">
        {imgVal ? (
          <Image
            src={imageUrl}
            alt={nameVal}
            width={48}
            height={48}
            className="w-full h-full object-contain"
            unoptimized
          />
        ) : (
          <ShoppingBag className="w-4 h-4 text-orange-500" />
        )}
      </div>

      {/* Right side: 3 lines parallel to image */}
      <div className="min-w-0 flex-1 space-y-0.5 text-xs text-gray-500 dark:text-neutral-400 font-normal">
        {/* Line 1: Tên sản phẩm - 1 dòng duy nhất và ... nếu quá dài */}
        <p className="text-xs font-normal text-gray-900 dark:text-neutral-100 truncate">
          {nameVal}
        </p>

        {/* Line 2: x1                          50.000đ */}
        <div className="flex items-center justify-between">
          <span>x{item.qty ?? 1}</span>
          <span>{formatCurrency(item.actual_amount)}</span>
        </div>

        {/* Line 3:                                10.000đ (Hoàn tiền) */}
        <div className="flex items-center justify-end">
          <span>{formatCurrency(actualCommission, { showPlus: actualCommission > 0 })}</span>
        </div>
      </div>
    </div>
  );
}

export function OrderItemsList({
  orders,
  platform = 'shopee',
  checkoutId,
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
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-neutral-400">
                <span>
                  {t('labels.checkout_id')}: {checkoutId || orderIdVal || ''}
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
    <div className="pt-2 border-t border-dashed border-gray-200 dark:border-neutral-800 space-y-3 animate-in fade-in duration-200">
      {orders.map((ord, oIdx) => {
        const orderIdVal = ord.id || ord.order_sn || ord.order_id;

        return (
          <div key={orderIdVal || oIdx} className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 gap-2 text-left pt-1 font-normal">
              <span className="truncate font-normal">
                {t('labels.checkout_id')}: {checkoutId || orderIdVal || '—'}
              </span>
            </div>
            <div className="space-y-1">
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
