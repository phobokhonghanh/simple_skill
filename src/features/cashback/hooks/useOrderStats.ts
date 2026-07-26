'use client';

import * as React from 'react';
import type { CashbackRecord } from '@/features/cashback/types';

/**
 * Custom hook phụ trách tính toán số liệu tổng tiền hoàn (totalCashback) và tạo tọa độ đường vẽ biểu đồ nhỏ (SVG Sparkline).
 *
 * @param orders - Mảng CashbackRecord các đơn hàng hoàn tiền.
 * @returns Đối tượng chứa totalCashback và đường dẫn strokePath, fillPath của đồ thị Sparkline.
 */
export function useOrderStats(orders: CashbackRecord[]) {
  const totalCashback = React.useMemo(() => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((acc, rec) => acc + Number(rec.cashback || 0), 0);
  }, [orders]);

  const sparklinePaths = React.useMemo(() => {
    if (!orders || orders.length === 0) {
      return { strokePath: '', fillPath: '' };
    }

    const values = orders
      .map((r) => Number(r.cashback || 0))
      .slice(0, 15)
      .reverse();

    if (values.length < 2) {
      return { strokePath: '', fillPath: '' };
    }

    const maxVal = Math.max(...values, 1);
    const width = 120;
    const height = 35;
    const step = width / (values.length - 1);

    const points = values.map((val, idx) => {
      const x = idx * step;
      const y = height - (val / maxVal) * (height - 6) - 3;
      return { x, y };
    });

    const dStroke = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const dFill = `${dStroke} L ${width},${height} L 0,${height} Z`;

    return { strokePath: dStroke, fillPath: dFill };
  }, [orders]);

  return {
    totalCashback,
    sparklinePaths,
  };
}
