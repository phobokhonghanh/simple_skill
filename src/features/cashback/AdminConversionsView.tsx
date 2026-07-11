'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { ConversionRecord } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatShopeeImageUrl, formatPrice, formatDate } from '@/features/cashback/utils';
import { StatusBadge } from '@/features/cashback/StatusBadge';

interface AdminConversionsViewProps {
  adminConversions: ConversionRecord[];
  loadingAdminConversions: boolean;
  adminError: string | null;
  adminPage: number;
  setAdminPage: React.Dispatch<React.SetStateAction<number>>;
  adminTotal: number;
  adminTotalPages: number;
  expandedAdminRecordId: string | null;
  setExpandedAdminRecordId: (id: string | null) => void;
  filterSubId: string;
  setFilterSubId: (s: string) => void;
  filterStart: string;
  setFilterStart: (s: string) => void;
  filterEnd: string;
  setFilterEnd: (s: string) => void;
  fetchAdminConversions: () => void;
}


export function AdminConversionsView({
  adminConversions,
  loadingAdminConversions,
  adminError,
  adminPage,
  setAdminPage,
  adminTotal,
  adminTotalPages,
  expandedAdminRecordId,
  setExpandedAdminRecordId,
  filterSubId,
  setFilterSubId,
  filterStart,
  setFilterStart,
  filterEnd,
  setFilterEnd,
  fetchAdminConversions,
}: AdminConversionsViewProps) {
  const t = useTranslations('cashback');



  return (
    <Card className="aff-card p-5 sm:p-6 rounded-2xl max-w-full overflow-hidden border-0 bg-transparent py-0 gap-0 shadow-none">
      <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2 border-b border-[var(--aff-border)] pb-3 mb-5">
        <Filter className="w-5 h-5 text-orange-500" />
        <span>{t('all_conversions')}</span>
      </h3>

      {/* Filters Form */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mb-6 text-left">
        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-[var(--aff-muted)]">Sub ID Filter</label>
          <input
            type="text"
            placeholder="Filter by User / Sub ID"
            value={filterSubId}
            onChange={(e) => setFilterSubId(e.target.value)}
            className="aff-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-[var(--aff-muted)]">Từ ngày</label>
          <input
            type="date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
            className="aff-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-[var(--aff-muted)]">Đến ngày</label>
          <input
            type="date"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
            className="aff-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setAdminPage(1);
              void fetchAdminConversions();
            }}
            className="aff-btn-primary py-1.5 px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1 font-bold flex-1 sm:flex-initial"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tìm</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setFilterSubId('');
              setFilterStart('');
              setFilterEnd('');
              setAdminPage(1);
              setTimeout(() => {
                void fetchAdminConversions();
              }, 0);
            }}
            className="bg-neutral-200 dark:bg-neutral-800 text-[var(--aff-text)] hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1.5 px-4 rounded-xl text-xs cursor-pointer font-bold flex-1 sm:flex-initial hover:bg-transparent"
          >
            Xóa
          </Button>
        </div>
      </div>

      {loadingAdminConversions ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[var(--aff-orange)] animate-spin" />
          <p className="text-xs text-[var(--aff-muted)]">Đang tải...</p>
        </div>
      ) : adminError ? (
        <div className="py-8 text-center text-red-500 text-xs sm:text-sm">{adminError}</div>
      ) : adminConversions.length === 0 ? (
        <div className="py-12 text-center text-xs sm:text-sm text-[var(--aff-muted)] border border-dashed border-[var(--aff-border)] rounded-xl">
          {t('no_conversions')}
        </div>
      ) : (
        <div className="space-y-4 max-w-full overflow-hidden">
          {/* Web View Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--aff-border)] text-[var(--aff-muted)] font-semibold">
                  <th className="py-3 px-2">Ngày Mua</th>
                  <th className="py-3 px-2">Sub ID (User)</th>
                  <th className="py-3 px-2">Checkout ID</th>
                  <th className="py-3 px-2">Tổng Đơn</th>
                  <th className="py-3 px-2">Hoa Hồng (Shopee)</th>
                  <th className="py-3 px-2 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {adminConversions.map((rec) => {
                  const purchaseDateStr = formatDate(rec.purchase_time);
                  const totalItems = rec.orders?.reduce((acc, o) => acc + (o.items?.length || 0), 0) || 0;
                  const isExpanded = expandedAdminRecordId === rec.checkout_id;
                  const totalAmount =
                    rec.orders?.reduce(
                      (acc, o) =>
                        acc + (o.items?.reduce((sum, item) => sum + (item.actual_amount || 0), 0) || 0),
                      0,
                    ) || 0;

                  return (
                    <React.Fragment key={rec.checkout_id}>
                      <tr
                        onClick={() => setExpandedAdminRecordId(isExpanded ? null : (rec.checkout_id || null))}
                        className="border-b border-[var(--aff-border)] hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-2">{purchaseDateStr}</td>
                        <td className="py-4 px-2 font-bold font-mono text-2xs truncate max-w-[120px]">
                          {rec.utm_content || 'system'}
                        </td>
                        <td className="py-4 px-2 font-mono text-2xs truncate max-w-[120px]">
                          {rec.checkout_id}
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-semibold block">{formatPrice(totalAmount)}</span>
                          <span className="text-[10px] text-[var(--aff-muted)]">
                            ({totalItems} sản phẩm)
                          </span>
                        </td>
                        <td className="py-4 px-2 font-bold text-orange-600 dark:text-orange-500">
                          {rec.affiliate_net_commission
                            ? parseFloat(rec.affiliate_net_commission).toLocaleString('vi-VN') + ' ₫'
                            : '0 ₫'}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <StatusBadge status={rec.checkout_status} />
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </td>
                      </tr>

                      {/* Product items inside orders */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={6}
                            className="bg-neutral-50/50 dark:bg-neutral-900/30 p-4 border-b border-[var(--aff-border)]"
                          >
                            <div className="space-y-4 pl-2 text-left">
                              <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--aff-muted)]">
                                Danh sách đơn hàng shopee
                              </h4>
                              <div className="divide-y divide-[var(--aff-border)]">
                                {rec.orders?.map((ord, oIdx) => (
                                  <div key={ord.order_id || oIdx} className="py-3">
                                    <div className="flex justify-between items-center text-2xs mb-2">
                                      <span className="font-mono text-[var(--aff-muted)]">
                                        Mã Đơn: {ord.order_id}
                                      </span>
                                      <StatusBadge status={ord.order_status} />
                                    </div>
                                    <div className="space-y-2.5">
                                      {ord.items?.map((item, itemIdx) => (
                                        <div key={itemIdx} className="flex justify-between items-start gap-4">
                                          <div className="flex gap-2 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded bg-white border border-[var(--aff-border)] flex-shrink-0 flex items-center justify-center overflow-hidden">
                                              {item.img_code ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                  src={formatShopeeImageUrl(item.img_code)}
                                                  alt=""
                                                  className="w-full h-full object-contain p-0.5"
                                                  loading="lazy"
                                                />
                                              ) : (
                                                <ShoppingBag className="w-4 h-4 text-orange-500" />
                                              )}
                                            </div>
                                            <div className="min-w-0">
                                              <p className="text-xs font-bold text-[var(--aff-heading)] line-clamp-1">
                                                {item.item_name}
                                              </p>
                                              <span className="text-3xs text-[var(--aff-muted)]">
                                                SL: {item.qty} • Shop: {item.shop_name || 'N/A'}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-xs font-semibold">
                                              {formatPrice(item.actual_amount)}
                                            </p>
                                            <span className="text-3xs text-orange-600 font-bold block">
                                              +{formatPrice(item.item_commission)} hoa hồng
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
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

          {/* Mobile View Cards Stack */}
          <div className="sm:hidden space-y-4 max-w-full overflow-hidden">
            {adminConversions.map((rec) => {
              const purchaseDateStr = formatDate(rec.purchase_time);
              const totalItems = rec.orders?.reduce((acc, o) => acc + (o.items?.length || 0), 0) || 0;
              const isExpanded = expandedAdminRecordId === rec.checkout_id;

              return (
                <div
                  key={rec.checkout_id}
                  className="p-4 rounded-xl border border-[var(--aff-border)] bg-neutral-50/30 dark:bg-neutral-900/10 space-y-3 text-left max-w-full overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-2xs font-mono text-[var(--aff-muted)] truncate max-w-[150px]">
                        ID: {rec.checkout_id}
                      </p>
                      <p className="text-3xs text-[var(--aff-muted)] mt-0.5">{purchaseDateStr}</p>
                    </div>
                    <StatusBadge status={rec.checkout_status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--aff-border)] text-xs">
                    <div>
                      <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] block">
                        Sub ID (User)
                      </span>
                      <span className="font-bold truncate max-w-[120px] block">
                        {rec.utm_content || 'system'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] block">
                        Hoa Hồng Shopee
                      </span>
                      <span className="font-extrabold text-orange-600 dark:text-orange-500 block">
                        {rec.affiliate_net_commission
                          ? parseFloat(rec.affiliate_net_commission).toLocaleString('vi-VN') + ' ₫'
                          : '0 ₫'}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setExpandedAdminRecordId(isExpanded ? null : (rec.checkout_id || null))}
                    className="w-full h-auto py-1.5 border border-[var(--aff-border)] rounded-lg text-3xs font-bold text-[var(--aff-muted)] flex items-center justify-center gap-1 cursor-pointer active:bg-orange-500/5 hover:text-orange-500 hover:border-orange-500/20 hover:bg-transparent"
                  >
                    <span>{isExpanded ? 'Ẩn chi tiết' : `Xem chi tiết (${totalItems} sản phẩm)`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </Button>

                  {/* Mobile Expanded Items */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-dashed border-[var(--aff-border)] space-y-3 animate-in fade-in duration-200">
                      {rec.orders?.map((ord, oIdx) => (
                        <div key={ord.order_id || oIdx} className="space-y-2.5">
                          <div className="flex justify-between items-center text-3xs font-mono text-[var(--aff-muted)] gap-2">
                            <span className="truncate max-w-[140px]">Mã đơn: {ord.order_id}</span>
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
                                    <span className="text-4xs text-[var(--aff-muted)] block">
                                      SL: {item.qty} • {formatPrice(item.actual_amount)}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-3xs font-bold text-orange-600 whitespace-nowrap flex-shrink-0">
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
          {adminTotalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--aff-border)] pt-4 mt-4 text-xs">
              <span className="text-2xs text-[var(--aff-muted)]">
                Tổng cộng: <span className="font-bold text-[var(--aff-text)]">{adminTotal}</span> bản ghi
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={adminPage <= 1}
                  onClick={() => {
                    setAdminPage((p) => Math.max(1, p - 1));
                    setTimeout(() => void fetchAdminConversions(), 0);
                  }}
                  className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-2xs px-2 font-semibold">
                  Trang {adminPage} / {adminTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={adminPage >= adminTotalPages}
                  onClick={() => {
                    setAdminPage((p) => Math.min(adminTotalPages, p + 1));
                    setTimeout(() => void fetchAdminConversions(), 0);
                  }}
                  className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
