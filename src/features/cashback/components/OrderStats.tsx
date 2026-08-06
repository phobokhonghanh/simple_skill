'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag } from 'lucide-react';
import Coin from '@/features/cashback/components/Coin';
import { StatCard } from '@/features/cashback/components/StatCard';
import { formatCurrency } from '@/features/cashback/utils';

export interface OrderStatsProps {
  totalCashback: number;
  totalOrders: number;
  sparklinePaths?: { strokePath: string; fillPath: string };
}

/**
 * Component hiển thị thẻ thống kê đơn hàng (Tổng hoàn tiền & Tổng số đơn).
 */
export function OrderStats({
  totalCashback,
  totalOrders,
  sparklinePaths,
}: OrderStatsProps) {
  const t = useTranslations('cashback');

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <StatCard
        title={t('labels.total_cashback')}
        value={
          <span className="text-orange-500 dark:text-orange-400 font-bold text-xs sm:text-base">
            {formatCurrency(totalCashback)}
          </span>
        }
        icon={<Coin size={24} className="coin-2d" animate={false} />}
        sparkline={sparklinePaths}
        className="rounded-md p-3 sm:p-4 gap-1.5 sm:gap-2"
      />
      <StatCard
        title={t('labels.recorded_orders')}
        value={
          <span className="text-gray-900 dark:text-neutral-100 font-bold text-xs sm:text-base">
            {`${totalOrders} ${t('labels.order_unit')}`}
          </span>
        }
        icon={<ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-neutral-300" />}
        iconBgClass="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300"
        className="rounded-md p-3 sm:p-4 gap-1.5 sm:gap-2"
      />
    </div>
  );
}
