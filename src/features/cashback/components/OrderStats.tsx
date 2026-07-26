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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <StatCard
        title={t('labels.total_cashback')}
        value={
          <span className="text-amber-500 dark:text-amber-400">
            {formatCurrency(totalCashback)}
          </span>
        }
        icon={<Coin size={28} className="coin-2d" animate={false} />}
        sparkline={sparklinePaths}
      />
      <StatCard
        title={t('labels.recorded_orders')}
        value={`${totalOrders} ${t('labels.order_unit')}`}
        icon={<ShoppingBag className="w-6 h-6" />}
        iconBgClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
      />
    </div>
  );
}
