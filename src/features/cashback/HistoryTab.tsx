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
  ChevronUp,
  Search,
} from 'lucide-react';
import type {
  CashbackRecord,
  ConversionRecord,
} from '@/features/cashback/types';
import Coin from '@/features/cashback/Coin';
import { Button } from '@/components/ui/button';
import {
  formatShopeeImageUrl,
  formatPrice,
  formatDate,
} from '@/features/cashback/utils';
import { StatusBadge } from '@/features/cashback/StatusBadge';
import { CashbackCard } from '@/features/cashback/CashbackCard';
import { FormattedDateInput } from '@/features/cashback/FormattedDateInput';

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
  burstCoins: { id: string; tx: number; ty: number }[];
  userSyncLoading: boolean;
  userSyncSuccess: boolean;
  userSyncMessage: string | null;
  userSyncData: ConversionRecord[] | null;
  showUserSyncModal: boolean;
  setShowUserSyncModal: (show: boolean) => void;
  handleUserSync: (startDate: string, endDate: string) => Promise<void>;
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
  processedUserHistory,
  uiTotalCashback,
  burstCoins,
  userSyncLoading,
  userSyncSuccess,
  userSyncMessage,
  userSyncData,
  showUserSyncModal,
  setShowUserSyncModal,
  handleUserSync,
}: HistoryTabProps) {
  const t = useTranslations('cashback');

  const [prevHistoryStart, setPrevHistoryStart] = React.useState(historyStart);
  const [prevHistoryEnd, setPrevHistoryEnd] = React.useState(historyEnd);
  const [tempStart, setTempStart] = React.useState(historyStart);
  const [tempEnd, setTempEnd] = React.useState(historyEnd);
  const [expandedSyncRecordId, setExpandedSyncRecordId] = React.useState<
    string | null
  >(null);
  const [isNoteOpen, setIsNoteOpen] = React.useState(false);

  if (historyStart !== prevHistoryStart || historyEnd !== prevHistoryEnd) {
    setPrevHistoryStart(historyStart);
    setPrevHistoryEnd(historyEnd);
    setTempStart(historyStart);
    setTempEnd(historyEnd);
  }

  const handleSearch = () => {
    setHistoryStart(tempStart);
    setHistoryEnd(tempEnd);
    setUserHistoryPage(1);
  };

  const handleCloseSyncModal = () => {
    setShowUserSyncModal(false);
    setExpandedSyncRecordId(null);
    setHistoryStart(tempStart);
    setHistoryEnd(tempEnd);
    setUserHistoryPage(1);
  };

  const formatDateString = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const sparklinePaths = React.useMemo(() => {
    // 1. Filter and sort records chronologically
    const sorted = [...processedUserHistory]
      .filter((r) => r.createdAt && r.status !== 'rejected')
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      });

    // 2. Build cumulative sums
    let currentSum = 0;
    let dataPoints: number[] = [];
    for (const r of sorted) {
      currentSum += r.cashback || 0;
      dataPoints.push(currentSum);
    }

    // Fallbacks to handle empty state or single items
    if (dataPoints.length === 0) {
      dataPoints = [0, 10000, 25000, 60000, 130000, 195000, 280000];
    } else if (dataPoints.length === 1) {
      dataPoints = [0, dataPoints[0]];
    }

    const minVal = Math.min(...dataPoints);
    const maxVal = Math.max(...dataPoints);
    const valRange = maxVal - minVal;

    // We want the Y coordinates to be between 18 (highest peak) and 23 (lowest floor)
    // inside viewBox="0 0 120 24". This keeps the wave strictly in the bottom 25% of the card height.
    const yMin = 18;
    const yMax = 23;
    const yRange = yMax - yMin;

    const points = dataPoints.map((val, i) => {
      const x = dataPoints.length > 1 ? (i / (dataPoints.length - 1)) * 120 : 0;
      const y =
        valRange > 0 ? yMax - ((val - minVal) / valRange) * yRange : yMax;
      return { x, y };
    });

    // Generate path with smooth Bezier curves
    let strokePath = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 3;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (2 * (curr.x - prev.x)) / 3;
      const cpY2 = curr.y;
      strokePath += ` C ${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
    }

    const fillPath = `${strokePath} L 120,24 L 0,24 Z`;

    return { strokePath, fillPath };
  }, [processedUserHistory]);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Total Cashback */}
        <div className="relative aff-card p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center relative shrink-0">
            <Coin size={28} className="coin-2d" animate={true} />
            {/* Burst coins animation */}
            {burstCoins.map((coin) => (
              <div
                key={coin.id}
                className="burst-coin"
                style={
                  {
                    '--tx': `${coin.tx}px`,
                    '--ty': `${coin.ty}px`,
                  } as React.CSSProperties
                }
              >
                <Coin size={12} animate={false} />
              </div>
            ))}
          </div>
          <div className="space-y-1 z-10">
            <span className="text-xs tracking-wider text-[var(--aff-muted)] block font-bold">
              {t('total_cashback')}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-500 dark:text-amber-400 block">
              {formatPrice(uiTotalCashback)}
            </span>
          </div>
          {/* Wave/Sparkline SVG */}
          <div className="absolute bottom-0 left-0 right-0 w-full h-6 pointer-events-none">
            <svg
              viewBox="0 0 120 24"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="amber-wave-grad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="rgb(245, 158, 11)"
                    stopOpacity="0.08"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(245, 158, 11)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <path
                d={sparklinePaths.strokePath}
                fill="none"
                stroke="rgb(245, 158, 11)"
                strokeWidth="1.2"
                className="opacity-30 dark:opacity-20"
              />
              <path d={sparklinePaths.fillPath} fill="url(#amber-wave-grad)" />
            </svg>
          </div>
        </div>

        {/* Card 2: Recorded Orders */}
        <div className="aff-card p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs tracking-wider text-[var(--aff-muted)] block font-bold">
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
            <span>{t('history_details_title')}</span>
          </h3>
          <Button
            onClick={() => handleUserSync(tempStart, tempEnd)}
            disabled={userSyncLoading || loadingHistory}
            className="bg-[var(--aff-orange)] hover:bg-[var(--aff-orange-hover)] text-white font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer h-9 shadow-sm shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${userSyncLoading ? 'animate-spin' : ''}`}
            />
            <span>{t('manual_sync')}</span>
          </Button>
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6 items-end text-left">
          {/* Từ ngày */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
              {t('start_date')}
            </label>
            <FormattedDateInput
              value={tempStart}
              onChange={setTempStart}
              className="w-full px-2.5 py-1.5 text-xs"
            />
          </div>

          {/* Đến ngày */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
              {t('end_date')}
            </label>
            <FormattedDateInput
              value={tempEnd}
              onChange={setTempEnd}
              className="w-full px-2.5 py-1.5 text-xs"
            />
          </div>

          {/* Tìm kiếm Button */}
          <div className="space-y-1">
            <Button
              onClick={handleSearch}
              className="w-full bg-[var(--aff-orange)] hover:bg-[var(--aff-orange-hover)] text-white gap-2 text-xs py-1.5 px-3 rounded-xl flex items-center justify-center font-bold transition-all h-[34px] cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('search')}</span>
            </Button>
          </div>

          {/* Platform Filter */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
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
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
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
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
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
            <p className="text-xs text-[var(--aff-muted)]">
              {t('loading_history')}
            </p>
          </div>
        ) : historyError ? (
          <div className="py-8 text-center text-red-500 text-xs sm:text-sm">
            {historyError}
          </div>
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
                      rec.conversion?.orders?.reduce(
                        (acc, o) => acc + (o.items?.length || 0),
                        0,
                      ) || 0;
                    const purchaseTime =
                      rec.conversion?.purchase_time ??
                      (rec.createdAt
                        ? Math.floor(new Date(rec.createdAt).getTime() / 1000)
                        : null);
                    const purchaseDateStr = formatDate(purchaseTime);
                    const isExpanded = expandedRecordId === rec.checkoutId;
                    const totalAmount =
                      rec.conversion?.orders?.reduce(
                        (acc, o) =>
                          acc +
                          (o.items?.reduce(
                            (sum, item) => sum + (item.actual_amount || 0),
                            0,
                          ) || 0),
                        0,
                      ) || 0;

                    return (
                      <React.Fragment key={rec.id || rec.checkoutId}>
                        <tr
                          onClick={() =>
                            setExpandedRecordId(
                              isExpanded ? null : rec.checkoutId || null,
                            )
                          }
                          className="border-b border-[var(--aff-border)] hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer transition-colors"
                        >
                          <td className="py-4.5 px-2 font-medium">
                            {purchaseDateStr}
                          </td>
                          <td className="py-4.5 px-2 font-mono text-2xs truncate max-w-[120px]">
                            {rec.checkoutId}
                          </td>
                          <td className="py-4.5 px-2">
                            <span className="bg-orange-500/10 text-[var(--aff-orange)] font-bold px-1.5 py-0.5 rounded-full text-3xs">
                              {totalItems} SP
                            </span>
                          </td>
                          <td className="py-4.5 px-2">
                            {formatPrice(totalAmount)}
                          </td>
                          <td className="py-4.5 px-2 font-bold text-orange-600 dark:text-orange-500">
                            {formatPrice(rec.cashback)}
                          </td>
                          <td className="py-4.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <StatusBadge status={rec.status} />
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
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
                                  <div
                                    key={ord.order_id || oIdx}
                                    className="space-y-2 text-left"
                                  >
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
                                                  src={formatShopeeImageUrl(
                                                    item.img_code,
                                                  )}
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
                                                Số lượng: {item.qty} • Đơn giá:{' '}
                                                {formatPrice(
                                                  item.actual_amount,
                                                )}
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
                const purchaseTime =
                  rec.conversion?.purchase_time ??
                  (rec.createdAt
                    ? Math.floor(new Date(rec.createdAt).getTime() / 1000)
                    : null);
                const totalAmount =
                  rec.conversion?.orders?.reduce(
                    (acc, o) =>
                      acc +
                      (o.items?.reduce(
                        (sum, item) => sum + (item.actual_amount || 0),
                        0,
                      ) || 0),
                    0,
                  ) || 0;

                return (
                  <CashbackCard
                    key={rec.id || rec.checkoutId}
                    checkoutId={rec.checkoutId || ''}
                    purchaseTime={purchaseTime}
                    status={rec.status || 'pending'}
                    totalAmount={totalAmount}
                    cashback={rec.cashback || 0}
                    orders={rec.conversion?.orders}
                    isExpanded={expandedRecordId === rec.checkoutId}
                    onToggleExpand={() =>
                      setExpandedRecordId(
                        expandedRecordId === rec.checkoutId
                          ? null
                          : rec.checkoutId || null,
                      )
                    }
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {userHistoryTotalPages > 0 && (
              <div className="flex items-center justify-between border-t border-[var(--aff-border)] pt-4 mt-4">
                <span className="text-2xs text-[var(--aff-muted)]">
                  {t('total_records', { total: userHistoryTotal })}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={userHistoryPage <= 1}
                    onClick={() =>
                      setUserHistoryPage((p) => Math.max(1, p - 1))
                    }
                    className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-2xs px-2 font-semibold">
                    {t('page_indicator', {
                      page: userHistoryPage,
                      totalPages: userHistoryTotalPages,
                    })}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={userHistoryPage >= userHistoryTotalPages}
                    onClick={() =>
                      setUserHistoryPage((p) =>
                        Math.min(userHistoryTotalPages, p + 1),
                      )
                    }
                    className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsible Note */}
        <div className="mt-6 border border-orange-500/20 dark:border-orange-500/10 rounded-2xl overflow-hidden bg-orange-500/5 dark:bg-orange-500/10">
          <button
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            className="w-full flex items-center justify-between p-4 font-bold text-xs text-amber-600 dark:text-amber-400 hover:bg-orange-500/5 dark:hover:bg-orange-500/5 transition-all text-left cursor-pointer select-none"
          >
            <span className="flex items-center gap-1.5">
              <span>{t('manual_sync_title')}</span>
            </span>
            {isNoteOpen ? (
              <ChevronUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
          </button>

          <div
            className={`transition-all duration-350 ease-in-out overflow-hidden ${
              isNoteOpen
                ? 'max-h-[500px] border-t border-orange-500/10'
                : 'max-h-0'
            }`}
          >
            <div className="p-4 pt-2 text-xs text-[var(--aff-muted)] leading-relaxed text-left">
              <ul className="list-disc pl-4 space-y-1.5">
                <li>
                  {t.rich('manual_sync_bullet1', {
                    b: (chunks) => (
                      <strong className="font-bold text-[var(--aff-text)]">
                        {chunks}
                      </strong>
                    ),
                  })}
                </li>
                <li>
                  {t.rich('manual_sync_bullet2', {
                    b: (chunks) => (
                      <strong className="font-bold text-[var(--aff-text)]">
                        {chunks}
                      </strong>
                    ),
                  })}
                </li>
                <li>
                  {t.rich('manual_sync_bullet3', {
                    b: (chunks) => (
                      <strong className="font-bold text-[var(--aff-text)]">
                        {chunks}
                      </strong>
                    ),
                  })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Modal/Popup */}
      {showUserSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--aff-bg)] border border-[var(--aff-border)] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative overflow-hidden flex flex-col gap-4 text-left animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--aff-border)] pb-3">
              <h4 className="font-extrabold text-sm sm:text-base text-[var(--aff-heading)] flex items-center gap-2">
                <RefreshCw
                  className={`w-4 h-4 text-[var(--aff-orange)] ${userSyncLoading ? 'animate-spin' : ''}`}
                />
                <span>{t('sync_modal_title')}</span>
              </h4>
              {!userSyncLoading && (
                <button
                  onClick={handleCloseSyncModal}
                  aria-label="Close"
                  className="text-[var(--aff-muted)] hover:text-[var(--aff-text)] transition-colors p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <span className="text-xl font-bold leading-none">
                    &times;
                  </span>
                </button>
              )}
            </div>

            {/* Body */}
            <div className="space-y-4 py-2">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-[var(--aff-border)] text-xs text-[var(--aff-muted)] space-y-1">
                <div>
                  {t('sync_modal_range', {
                    range: `${formatDateString(tempStart)} - ${formatDateString(tempEnd)}`,
                  })}
                </div>
              </div>

              {userSyncLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-[var(--aff-orange)] animate-spin" />
                  <p className="text-xs text-[var(--aff-muted)] text-center animate-pulse">
                    {t('sync_modal_loading')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userSyncSuccess ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        {t('sync_modal_success_prefix', {
                          count: userSyncData?.length ?? 0,
                        })}
                      </div>

                      {userSyncData && userSyncData.length > 0 ? (
                        <div className="max-h-[24rem] overflow-y-auto space-y-3 pr-1">
                          {userSyncData.map((item, idx) => {
                            const totalAmount =
                              item.orders?.reduce(
                                (acc, o) =>
                                  acc +
                                  (o.items?.reduce(
                                    (sum, it) => sum + (it.actual_amount || 0),
                                    0,
                                  ) || 0),
                                0,
                              ) || 0;

                            return (
                              <CashbackCard
                                key={item.checkout_id || idx}
                                checkoutId={item.checkout_id || ''}
                                purchaseTime={item.purchase_time || null}
                                status={item.checkout_status || 'pending'}
                                totalAmount={totalAmount}
                                cashback={Number(
                                  item.affiliate_net_commission || 0,
                                )}
                                orders={item.orders}
                                isExpanded={
                                  expandedSyncRecordId === item.checkout_id
                                }
                                onToggleExpand={() =>
                                  setExpandedSyncRecordId(
                                    expandedSyncRecordId === item.checkout_id
                                      ? null
                                      : item.checkout_id || null,
                                  )
                                }
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--aff-muted)] text-center py-4">
                          {t('sync_modal_empty')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs">
                      {userSyncMessage || t('sync_modal_failed')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!userSyncLoading && (
              <div className="border-t border-[var(--aff-border)] pt-3 flex justify-end">
                <Button
                  onClick={handleCloseSyncModal}
                  className="bg-[var(--aff-orange)] hover:bg-[var(--aff-orange-hover)] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  {t('sync_modal_close')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
