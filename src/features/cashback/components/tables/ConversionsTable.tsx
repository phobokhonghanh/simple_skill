'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, ChevronsUpDown, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/features/cashback/components/StatusBadge';
import { FraudNotice } from '@/features/cashback/components/FraudNotice';
import { OrderItemsList } from '@/features/cashback/components/OrderItemsList';
import { CashbackCard } from '@/features/cashback/components/cards/CashbackCard';
import {
  formatCurrency,
  getPlatformStyle,
  extractCashbackSummary,
} from '@/features/cashback/utils';
import type { CashbackRecord, Pagination } from '@/features/cashback/types';
import {
  PLATFORM_OPTIONS,
  STATUS_OPTIONS,
  KNOWN_STATUS_VALUES,
} from '@/features/cashback/config';
import { Pagination as PaginationControl } from '@/components/ui/Pagination';

export interface ConversionsTableProps {
  records: CashbackRecord[];
  role?: 'user' | 'admin';
  loading: boolean;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
}

/**
 * Component Bảng chuyển đổi / Đơn hàng nhận duy nhất mảng `CashbackRecord[]`,
 * tích hợp sẵn bộ lọc, sắp xếp, chi tiết sản phẩm và phân trang.
 */
export function ConversionsTable({
  records,
  role = 'user',
  loading,
  pagination,
  onPageChange,
}: ConversionsTableProps) {
  const t = useTranslations('cashback');
  const isAdmin = role === 'admin';

  const activePage = pagination?.page ?? 1;
  const activeTotalPages = pagination?.totalPages ?? 0;
  const activeTotalRecords = pagination?.total ?? 0;

  // Internal UI State (bộ lọc, sắp xếp, mở rộng hàng)
  const [expandedRecordId, setExpandedRecordId] = React.useState<string | null>(
    null,
  );
  const [filterPlatform, setFilterPlatform] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [sortByTime, setSortByTime] = React.useState<'desc' | 'asc'>('desc');

  // Trích xuất dữ liệu nội bộ trong bảng
  const normalizedRecords = React.useMemo(() => {
    if (!records || !Array.isArray(records)) return [];
    return records.map((item) => extractCashbackSummary(item));
  }, [records]);

  // Bộ lọc & sắp xếp nội bộ
  const filteredRecords = React.useMemo(() => {
    let result = [...normalizedRecords];

    if (filterPlatform !== 'all') {
      result = result.filter(
        (r) => r.platform?.toLowerCase() === filterPlatform.toLowerCase(),
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((r) => {
        const statusStr = r.displayStatus || 'pending';
        return statusStr.toLowerCase() === filterStatus.toLowerCase();
      });
    }

    result.sort((a, b) => {
      const timeA = a.purchaseTime ?? 0;
      const timeB = b.purchaseTime ?? 0;
      return sortByTime === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [normalizedRecords, filterPlatform, filterStatus, sortByTime]);

  const getStatusFilterLabel = React.useCallback(
    (statusKey: string) => {
      if (statusKey === 'all') return t('common.status');
      if (KNOWN_STATUS_VALUES.includes(statusKey.toLowerCase())) {
        return t(`status.${statusKey.toLowerCase()}`);
      }
      return statusKey;
    },
    [t],
  );

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[var(--aff-border)] text-[var(--aff-muted)] font-semibold text-2xs tracking-wider">
              {isAdmin && (
                <th className="py-3 px-2 text-center">{t('common.sub_id')}</th>
              )}

              <th className="py-3 px-2 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setSortByTime(sortByTime === 'desc' ? 'asc' : 'desc')
                  }
                  aria-label={t('sort.by_time')}
                  className="inline-flex items-center gap-1 cursor-pointer select-none hover:text-[var(--aff-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aff-orange)] rounded px-1.5 py-0.5"
                >
                  <span>{t('labels.purchase_time')}</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
                </button>
              </th>

              <th className="py-3 px-2 text-center">
                <div className="inline-flex items-center gap-1 relative cursor-pointer group focus-within:ring-2 focus-within:ring-[var(--aff-orange)] rounded px-1.5 py-0.5">
                  <span className="capitalize">
                    {filterPlatform === 'all'
                      ? t('common.platform')
                      : filterPlatform}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--aff-muted)] shrink-0" />
                  <select
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    aria-label={t('common.platform')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus:outline-none"
                  >
                    {PLATFORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="py-3 px-2 text-center">
                {t('labels.checkout_id')}
              </th>

              <th className="py-3 px-2 text-center">
                {t('labels.total_order')}
              </th>

              <th className="py-3 px-2 text-center">{t('common.cashback')}</th>

              <th className="py-3 px-2 text-center">
                <div className="inline-flex items-center gap-1 relative cursor-pointer group focus-within:ring-2 focus-within:ring-[var(--aff-orange)] rounded px-1.5 py-0.5">
                  <span className="capitalize">
                    {getStatusFilterLabel(filterStatus)}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--aff-muted)] shrink-0" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    aria-label={t('common.status')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr
                  key={`skeleton-${idx}`}
                  className="border-b border-[var(--aff-border)] animate-pulse"
                >
                  {isAdmin && (
                    <td className="py-4 px-2 text-center">
                      <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                    </td>
                  )}
                  <td className="py-4 px-2 text-center">
                    <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="h-3 w-14 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full mx-auto" />
                  </td>
                </tr>
              ))
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="py-16 text-center border-b border-[var(--aff-border)]"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[var(--aff-muted)] max-w-sm mx-auto">
                      {t('orders.empty_order')}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => {
                const isExpanded = expandedRecordId === rec.checkoutId;

                return (
                  <React.Fragment key={rec.id}>
                    <tr
                      className={`hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors ${
                        isExpanded ? '' : 'border-b border-[var(--aff-border)]'
                      }`}
                    >
                      {isAdmin && (
                        <td className="py-4 px-2 font-bold font-mono text-2xs truncate max-w-[120px] text-center">
                          {rec.utmContent || t('common.system')}
                        </td>
                      )}

                      <td className="py-4 px-2 font-medium text-center">
                        {rec.purchaseDateStr}
                      </td>

                      <td
                        className={`py-4 px-2 font-bold capitalize text-center ${getPlatformStyle(rec.platform).color}`}
                      >
                        {rec.platform}
                      </td>

                      <td className="py-4 px-2 font-mono text-2xs truncate max-w-[120px] text-center">
                        {rec.checkoutId}
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRecordId(
                            isExpanded ? null : rec.checkoutId,
                          );
                        }}
                        className="py-4 px-2 text-center cursor-pointer select-none relative"
                      >
                        <div className="inline-block text-center group">
                          <span className="font-semibold block group-hover:underline">
                            {formatCurrency(rec.totalAmount)}
                          </span>
                          <span className="text-[10px] text-[var(--aff-muted)] block">
                            (
                            {t('labels.products_count', {
                              count: rec.totalItems,
                            })}
                            )
                          </span>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[var(--aff-muted)]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--aff-muted)]" />
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-2 font-bold text-amber-500 dark:text-amber-400 text-center">
                        {formatCurrency(rec.displayCashback)}
                      </td>

                      <td className="py-4 px-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <StatusBadge status={rec.displayStatus} />
                          {rec.hasFraud && (
                            <FraudNotice platform={rec.platform} />
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && rec.orders && (
                      <tr>
                        <td
                          colSpan={isAdmin ? 7 : 6}
                          className="bg-neutral-50/50 dark:bg-neutral-900/30 p-4 border-b border-[var(--aff-border)]"
                        >
                          <OrderItemsList
                            orders={rec.orders}
                            platform={rec.platform}
                            variant="desktop"
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="sm:hidden space-y-4 max-w-full overflow-hidden">
        <div className="grid grid-cols-3 gap-2 mb-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
              {t('common.platform')}
            </label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="aff-input w-full px-2.5 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-[var(--aff-border)] h-[34px] cursor-pointer"
            >
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
              {t('common.status')}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label={t('common.status')}
              className="aff-input w-full px-2.5 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-[var(--aff-border)] h-[34px] cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--aff-muted)] tracking-wider block">
              {t('labels.purchase_time')}
            </label>
            <Button
              variant="outline"
              onClick={() =>
                setSortByTime(sortByTime === 'desc' ? 'asc' : 'desc')
              }
              className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border border-[var(--aff-border)] text-xs h-[34px] bg-white dark:bg-zinc-900 cursor-pointer hover:bg-zinc-50 hover:text-[var(--aff-text)] active:scale-100"
            >
              {sortByTime === 'desc' ? (
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 shrink-0" />
              )}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`mobile-skeleton-${idx}`}
                className="p-4 rounded-xl border border-[var(--aff-border)] bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--aff-border)]">
                  <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded justify-self-end" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 px-4 text-center text-xs text-[var(--aff-muted)] border border-dashed border-[var(--aff-border)] rounded-xl flex flex-col items-center justify-center space-y-2">
            <ShoppingBag className="w-6 h-6 text-orange-500/60" />
            <span>{t('orders.empty_order')}</span>
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const isExpanded = expandedRecordId === rec.checkoutId;
            return (
              <CashbackCard
                key={rec.id}
                record={rec.raw}
                summary={rec}
                role={role}
                isExpanded={isExpanded}
                onToggleExpand={() =>
                  setExpandedRecordId(isExpanded ? null : rec.checkoutId)
                }
              />
            );
          })
        )}
      </div>

      {/* Internal Pagination Integration */}
      {activeTotalPages > 0 && onPageChange && (
        <PaginationControl
          currentPage={activePage}
          totalPages={activeTotalPages}
          totalRecords={activeTotalRecords}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
