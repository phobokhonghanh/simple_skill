'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Loader2,
  TrendingUp,
  RefreshCw,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { CashbackRecord } from '@/features/cashback/types';
import Coin from '@/features/cashback/Coin';
import { Button } from '@/components/ui/button';
import { formatShopeeImageUrl, formatPrice, formatDate } from '@/features/cashback/utils';
import { StatusBadge } from '@/features/cashback/StatusBadge';

interface HistoryTabProps {
  loadingHistory: boolean;
  historyError: string | null;
  expandedRecordId: string | null;
  setExpandedRecordId: (id: string | null) => void;
  userHistoryPage: number;
  setUserHistoryPage: React.Dispatch<React.SetStateAction<number>>;
  userHistoryTotal: number;
  userHistoryTotalPages: number;
  historyStart: string;
  setHistoryStart: (val: string) => void;
  historyEnd: string;
  setHistoryEnd: (val: string) => void;
  filterPlatform: string;
  setFilterPlatform: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  sortByTime: 'desc' | 'asc';
  setSortByTime: (val: 'desc' | 'asc') => void;
  fetchUserHistory: () => void;
  processedUserHistory: CashbackRecord[];
  uiTotalCashback: number;
  burstCoins: { id: number; tx: number; ty: number }[];
}


export function HistoryTab({
  loadingHistory,
  historyError,
  expandedRecordId,
  setExpandedRecordId,
  userHistoryPage,
  setUserHistoryPage,
  userHistoryTotal,
  userHistoryTotalPages,
  historyStart,
  setHistoryStart,
  historyEnd,
  setHistoryEnd,
  filterPlatform,
  setFilterPlatform,
  filterStatus,
  setFilterStatus,
  sortByTime,
  setSortByTime,
  fetchUserHistory,
  processedUserHistory,
  uiTotalCashback,
  burstCoins,
}: HistoryTabProps) {
  const t = useTranslations('cashback');

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Total Cashback */}
        <div className="relative aff-card p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center relative shrink-0">
            <Coin size={28} className="coin-2d" animate={true} />
            {/* Burst coins animation */}
            {burstCoins.map((coin) => (
              <div
                key={coin.id}
                className="burst-coin"
                style={{
                  '--tx': `${coin.tx}px`,
                  '--ty': `${coin.ty}px`,
                } as React.CSSProperties}
              >
                <Coin size={12} animate={false} />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[var(--aff-muted)] block font-bold">
              {t('total_cashback')}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {formatPrice(uiTotalCashback)}
            </span>
          </div>
        </div>

        {/* Card 2: Recorded Orders */}
        <div className="aff-card p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[var(--aff-muted)] block font-bold">
              {t('recorded_orders')}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[var(--aff-text)] block">
              {userHistoryTotal} {t('order_unit')}
            </span>
          </div>
        </div>
      </div>

      {/* List and Tables of Cashbacks */}
      <div className="aff-card p-6 sm:p-8 rounded-2xl max-w-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--aff-border)] pb-4 mb-4">
          <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--aff-orange)]" />
            <span>{t('history_tab')}</span>
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchUserHistory}
            disabled={loadingHistory}
            className="p-1.5 hover:bg-orange-500/10 rounded-lg text-[var(--aff-muted)] hover:text-[var(--aff-orange)] transition-colors cursor-pointer"
          >
            {loadingHistory ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--aff-orange)]" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6 items-end text-left">
          {/* Từ ngày */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] uppercase tracking-wider block">
              {t('start_date')}
            </label>
            <input
              type="date"
              value={historyStart}
              onChange={(e) => {
                setHistoryStart(e.target.value);
                setUserHistoryPage(1);
              }}
              className="aff-input w-full px-2.5 py-1.5 rounded-xl text-xs"
            />
          </div>

          {/* Đến ngày */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] uppercase tracking-wider block">
              {t('end_date')}
            </label>
            <input
              type="date"
              value={historyEnd}
              onChange={(e) => {
                setHistoryEnd(e.target.value);
                setUserHistoryPage(1);
              }}
              className="aff-input w-full px-2.5 py-1.5 rounded-xl text-xs"
            />
          </div>

          {/* Platform Filter */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] uppercase tracking-wider block">
              {t('filter_platform')}
            </label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="aff-input w-full px-2.5 py-1.5 rounded-xl text-xs"
            >
              <option value="all">{t('all_platforms')}</option>
              <option value="shopee">Shopee</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] uppercase tracking-wider block">
              {t('filter_status')}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="aff-input w-full px-2.5 py-1.5 rounded-xl text-xs"
            >
              <option value="all">{t('all_statuses')}</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort by Time */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] uppercase tracking-wider block">
              {t('sort_by_time')}
            </label>
            <select
              value={sortByTime}
              onChange={(e) => setSortByTime(e.target.value as 'desc' | 'asc')}
              className="aff-input w-full px-2.5 py-1.5 rounded-xl text-xs"
            >
              <option value="desc">{t('sort_newest')}</option>
              <option value="asc">{t('sort_oldest')}</option>
            </select>
          </div>
        </div>

        {loadingHistory ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[var(--aff-orange)] animate-spin" />
            <p className="text-xs text-[var(--aff-muted)]">{t('loading_history')}</p>
          </div>
        ) : historyError ? (
          <div className="py-8 text-center text-red-500 text-xs sm:text-sm">{historyError}</div>
        ) : processedUserHistory.length === 0 ? (
          <div className="py-12 text-center text-xs sm:text-sm text-[var(--aff-muted)] border border-dashed border-[var(--aff-border)] rounded-xl">
            {t('no_cashback')}
          </div>
        ) : (
          <div className="space-y-4 max-w-full overflow-hidden">
            {/* Web Table View - Visible on sm and up */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--aff-border)] text-[var(--aff-muted)] font-semibold">
                    <th className="py-3 px-2">Ngày Mua</th>
                    <th className="py-3 px-2">{t('checkout_id')}</th>
                    <th className="py-3 px-2">Sản phẩm</th>
                    <th className="py-3 px-2">Tổng Đơn</th>
                    <th className="py-3 px-2">Hoàn Tiền</th>
                    <th className="py-3 px-2 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {processedUserHistory.map((rec) => {
                    const totalItems =
                      rec.conversion?.orders?.reduce((acc, o) => acc + (o.items?.length || 0), 0) || 0;
                    const purchaseTime =
                      rec.conversion?.purchase_time ??
                      (rec.createdAt ? Math.floor(new Date(rec.createdAt).getTime() / 1000) : null);
                    const purchaseDateStr = formatDate(purchaseTime);
                    const isExpanded = expandedRecordId === rec.checkoutId;
                    const totalAmount =
                      rec.conversion?.orders?.reduce(
                        (acc, o) =>
                          acc + (o.items?.reduce((sum, item) => sum + (item.actual_amount || 0), 0) || 0),
                        0,
                      ) || 0;

                    return (
                      <React.Fragment key={rec.id || rec.checkoutId}>
                        <tr
                          onClick={() => setExpandedRecordId(isExpanded ? null : (rec.checkoutId || null))}
                          className="border-b border-[var(--aff-border)] hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer transition-colors"
                        >
                          <td className="py-4.5 px-2 font-medium">{purchaseDateStr}</td>
                          <td className="py-4.5 px-2 font-mono text-2xs truncate max-w-[120px]">
                            {rec.checkoutId}
                          </td>
                          <td className="py-4.5 px-2">
                            <span className="bg-orange-500/10 text-[var(--aff-orange)] font-bold px-1.5 py-0.5 rounded-full text-3xs">
                              {totalItems} SP
                            </span>
                          </td>
                          <td className="py-4.5 px-2">{formatPrice(totalAmount)}</td>
                          <td className="py-4.5 px-2 font-bold text-orange-600 dark:text-orange-500">
                            {formatPrice(rec.cashback)}
                          </td>
                          <td className="py-4.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <StatusBadge status={rec.status} />
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Products list for table */}
                        {isExpanded && rec.conversion && (
                          <tr>
                            <td
                              colSpan={6}
                              className="bg-neutral-50/50 dark:bg-neutral-900/30 p-4 border-b border-[var(--aff-border)]"
                            >
                              <div className="space-y-3 pl-2">
                                {rec.conversion.orders?.map((ord, oIdx) => (
                                  <div key={ord.order_id || oIdx} className="space-y-2 text-left">
                                    <div className="flex justify-between items-center text-xs font-semibold text-[var(--aff-muted)] pb-1 border-b border-[var(--aff-border)]/50">
                                      <span>Mã đơn hàng: {ord.order_id}</span>
                                      <StatusBadge status={ord.order_status} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 pt-1">
                                      {ord.items?.map((item, itemIdx) => (
                                        <div
                                          key={itemIdx}
                                          className="flex items-center justify-between gap-4 py-1 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 rounded-lg px-2"
                                        >
                                          <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded border border-[var(--aff-border)] bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                                              {item.img_code ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                  src={formatShopeeImageUrl(item.img_code)}
                                                  alt=""
                                                  className="w-full h-full object-contain"
                                                />
                                              ) : (
                                                <ShoppingBag className="w-4 h-4 text-orange-500" />
                                              )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className="font-bold text-xs truncate max-w-sm">
                                                {item.item_name}
                                              </p>
                                              <p className="text-3xs text-[var(--aff-muted)] mt-0.5">
                                                Số lượng: {item.qty} • Đơn giá: {formatPrice(item.actual_amount)}
                                              </p>
                                            </div>
                                          </div>
                                          <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                                            +{formatPrice(item.item_commission)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Responsive Mobile List View - Visible on small screens */}
            <div className="sm:hidden space-y-4 max-w-full overflow-hidden">
              {processedUserHistory.map((rec) => {
                const totalItems =
                  rec.conversion?.orders?.reduce((acc, o) => acc + (o.items?.length || 0), 0) || 0;
                const purchaseTime =
                  rec.conversion?.purchase_time ??
                  (rec.createdAt ? Math.floor(new Date(rec.createdAt).getTime() / 1000) : null);
                const purchaseDateStr = formatDate(purchaseTime);
                const isExpanded = expandedRecordId === rec.checkoutId;
                const totalAmount =
                  rec.conversion?.orders?.reduce(
                    (acc, o) =>
                      acc + (o.items?.reduce((sum, item) => sum + (item.actual_amount || 0), 0) || 0),
                    0,
                  ) || 0;

                return (
                  <div
                    key={rec.id || rec.checkoutId}
                    className="aff-card p-5 rounded-2xl space-y-4 text-left max-w-full overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-2 max-w-full overflow-hidden">
                      <div className="min-w-0 flex-1">
                        <p className="text-2xs font-mono text-[var(--aff-muted)] truncate max-w-[150px] break-all">
                          ID: {rec.checkoutId}
                        </p>
                        <p className="text-3xs text-[var(--aff-muted)] mt-0.5">{purchaseDateStr}</p>
                      </div>
                      <StatusBadge status={rec.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--aff-border)]">
                      <div>
                        <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
                          {t('amount')}
                        </span>
                        <p className="text-sm font-bold text-[var(--aff-text)] mt-0.5">{formatPrice(totalAmount)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
                          {t('commission')}
                        </span>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {formatPrice(rec.cashback)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setExpandedRecordId(isExpanded ? null : (rec.checkoutId || null))}
                      className="w-full h-auto py-1.5 border border-[var(--aff-border)] rounded-lg text-3xs font-bold text-[var(--aff-muted)] flex items-center justify-center gap-1 cursor-pointer active:bg-orange-500/5 hover:text-orange-500 hover:border-orange-500/20 hover:bg-transparent"
                    >
                      <span>
                        {isExpanded
                          ? t('hide_details')
                          : t('show_details', { count: totalItems })}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </Button>

                    {/* Expanded products lists on mobile */}
                    {isExpanded && rec.conversion && (
                      <div className="pt-2 border-t border-dashed border-[var(--aff-border)] space-y-3 animate-in fade-in duration-200">
                        {rec.conversion.orders?.map((ord, oIdx) => (
                          <div key={ord.order_id || oIdx} className="space-y-2.5">
                            <div className="flex justify-between items-center text-3xs font-mono text-[var(--aff-muted)] gap-2">
                              <span className="truncate max-w-[140px]">{t('order_id')}: {ord.order_id}</span>
                              <StatusBadge status={ord.order_status} />
                            </div>
                            <div className="space-y-3">
                              {ord.items?.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex gap-2 items-start justify-between min-w-0">
                                  <div className="flex gap-2 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded bg-white border border-[var(--aff-border)] flex-shrink-0 flex items-center justify-center overflow-hidden">
                                      {item.img_code ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={formatShopeeImageUrl(item.img_code)}
                                          alt=""
                                          className="w-full h-full object-contain"
                                        />
                                      ) : (
                                        <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-3xs font-bold text-[var(--aff-heading)] line-clamp-1 break-words">
                                        {item.item_name}
                                      </p>
                                      <span className="text-4xs text-[var(--aff-muted)] block mt-0.5">
                                        {t('qty')}: {item.qty} • {formatPrice(item.actual_amount)}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-3xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap flex-shrink-0">
                                    +{formatPrice(item.item_commission)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {userHistoryTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--aff-border)] pt-4 mt-4">
                <span className="text-2xs text-[var(--aff-muted)]">
                  {t('total_records', { total: userHistoryTotal })}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={userHistoryPage <= 1}
                    onClick={() => setUserHistoryPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-2xs px-2 font-semibold">
                    {t('page_indicator', { page: userHistoryPage, totalPages: userHistoryTotalPages })}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={userHistoryPage >= userHistoryTotalPages}
                    onClick={() => setUserHistoryPage((p) => Math.min(userHistoryTotalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
