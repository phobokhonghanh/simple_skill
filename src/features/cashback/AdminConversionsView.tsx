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
  ChevronRight,
} from 'lucide-react';
import type { ConversionRecord } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  formatShopeeImageUrl,
  formatPrice,
  formatDate,
} from '@/features/cashback/utils';
import { StatusBadge } from '@/features/cashback/StatusBadge';
import { FormattedDateInput } from '@/features/cashback/FormattedDateInput';

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
          <label className="text-2xs font-bold text-[var(--aff-muted)]">
            {t('filter_sub_id')}
          </label>
          <input
            type="text"
            placeholder={t('filter_sub_id')}
            value={filterSubId}
            onChange={(e) => setFilterSubId(e.target.value)}
            className="aff-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-[var(--aff-muted)]">
            {t('start_date')}
          </label>
          <FormattedDateInput
            value={filterStart}
            onChange={setFilterStart}
            className="w-full px-3 py-1.5 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-[var(--aff-muted)]">
            {t('end_date')}
          </label>
          <FormattedDateInput
            value={filterEnd}
            onChange={setFilterEnd}
            className="w-full px-3 py-1.5 text-xs"
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
            <span>{t('search')}</span>
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
            {t('clear')}
          </Button>
        </div>
      </div>

      {loadingAdminConversions ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[var(--aff-orange)] animate-spin" />
          <p className="text-xs text-[var(--aff-muted)]">
            {t('loading_history')}
          </p>
        </div>
      ) : adminError ? (
        <div className="py-8 text-center text-red-500 text-xs sm:text-sm">
          {adminError}
        </div>
      ) : !adminConversions || adminConversions.length === 0 ? (
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
                  <th className="py-3 px-2">{t('purchase_time')}</th>
                  <th className="py-3 px-2">{t('sub_id_user')}</th>
                  <th className="py-3 px-2">{t('checkout_id')}</th>
                  <th className="py-3 px-2">{t('total_order')}</th>
                  <th className="py-3 px-2">{t('shopee_commission')}</th>
                  <th className="py-3 px-2 text-right">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {adminConversions?.map((rec) => {
                  const purchaseDateStr = formatDate(rec.purchase_time);
                  const totalItems =
                    rec.orders?.reduce(
                      (acc, o) => acc + (o.items?.length || 0),
                      0,
                    ) || 0;
                  const isExpanded = expandedAdminRecordId === rec.checkout_id;
                  const totalAmount =
                    rec.orders?.reduce(
                      (acc, o) =>
                        acc +
                        (o.items?.reduce(
                          (sum, item) => sum + (item.actual_amount || 0),
                          0,
                        ) || 0),
                      0,
                    ) || 0;

                  return (
                    <React.Fragment key={rec.checkout_id}>
                      <tr
                        onClick={() =>
                          setExpandedAdminRecordId(
                            isExpanded ? null : rec.checkout_id || null,
                          )
                        }
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
                          <span className="font-semibold block">
                            {formatPrice(totalAmount)}
                          </span>
                          <span className="text-[10px] text-[var(--aff-muted)]">
                            ({t('products_count', { count: totalItems })})
                          </span>
                        </td>
                        <td className="py-4 px-2 font-bold text-amber-500 dark:text-amber-400">
                          {rec.affiliate_net_commission
                            ? parseFloat(
                                rec.affiliate_net_commission,
                              ).toLocaleString('vi-VN') + ' ₫'
                            : '0 ₫'}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <StatusBadge status={rec.checkout_status} />
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
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
                                {t('shopee_order_list')}
                              </h4>
                              <div className="divide-y divide-[var(--aff-border)]">
                                {rec.orders?.map((ord, oIdx) => {
                                  const orderIdVal =
                                    ord.id || ord.order_sn || ord.order_id;
                                  return (
                                    <div
                                      key={orderIdVal || oIdx}
                                      className="py-3"
                                    >
                                      <div className="flex justify-between items-center text-2xs mb-2">
                                        <span className="font-mono text-[var(--aff-muted)]">
                                          {t('order_code_prefix', {
                                            id: orderIdVal || '—',
                                          })}
                                        </span>
                                        <StatusBadge
                                          status={ord.order_status}
                                        />
                                      </div>
                                      <div className="space-y-2.5">
                                        {ord.items?.map((item, itemIdx) => {
                                          const imgVal =
                                            item.product?.image ||
                                            item.img_code;
                                          const nameVal =
                                            item.product?.name ||
                                            item.item_name;
                                          const shopVal =
                                            item.product?.shop ||
                                            item.shop_name ||
                                            'N/A';
                                          const commissionVal =
                                            item.product?.commission ||
                                            item.item_commission;
                                          return (
                                            <div
                                              key={itemIdx}
                                              className="flex justify-between items-start gap-4"
                                            >
                                              <div className="flex gap-2 flex-1 min-w-0">
                                                <div className="w-8 h-8 rounded bg-white border border-[var(--aff-border)] flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                  {imgVal ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                      src={formatShopeeImageUrl(
                                                        imgVal,
                                                      )}
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
                                                    {nameVal || '—'}
                                                  </p>
                                                  <span className="text-3xs text-[var(--aff-muted)]">
                                                    {t('qty_shop_prefix', {
                                                      qty: item.qty ?? 0,
                                                      shop: shopVal,
                                                    })}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-xs font-semibold">
                                                  {formatPrice(
                                                    item.actual_amount,
                                                  )}
                                                </p>
                                                <span className="text-3xs text-amber-500 dark:text-amber-400 font-bold block">
                                                  {t('commission_suffix', {
                                                    amount:
                                                      formatPrice(
                                                        commissionVal,
                                                      ),
                                                  })}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
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
            {adminConversions?.map((rec) => {
              const purchaseDateStr = formatDate(rec.purchase_time);
              const totalItems =
                rec.orders?.reduce(
                  (acc, o) => acc + (o.items?.length || 0),
                  0,
                ) || 0;
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
                      <p className="text-3xs text-[var(--aff-muted)] mt-0.5">
                        {purchaseDateStr}
                      </p>
                    </div>
                    <StatusBadge status={rec.checkout_status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--aff-border)] text-xs">
                    <div>
                      <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] block">
                        {t('sub_id_user')}
                      </span>
                      <span className="font-bold truncate max-w-[120px] block">
                        {rec.utm_content || 'system'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] block">
                        {t('shopee_commission')}
                      </span>
                      <span className="font-bold text-amber-500 dark:text-amber-400 block">
                        {rec.affiliate_net_commission
                          ? parseFloat(
                              rec.affiliate_net_commission,
                            ).toLocaleString('vi-VN') + ' ₫'
                          : '0 ₫'}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setExpandedAdminRecordId(
                        isExpanded ? null : rec.checkout_id || null,
                      )
                    }
                    className="w-full h-auto py-1.5 border border-[var(--aff-border)] rounded-lg text-3xs font-bold text-[var(--aff-muted)] flex items-center justify-center gap-1 cursor-pointer active:bg-orange-500/5 hover:text-orange-500 hover:border-orange-500/20 hover:bg-transparent"
                  >
                    <span>
                      {isExpanded
                        ? t('hide_details')
                        : t('show_details', { count: totalItems })}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </Button>

                  {/* Mobile Expanded Items */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-dashed border-[var(--aff-border)] space-y-3 animate-in fade-in duration-200">
                      {rec.orders?.map((ord, oIdx) => {
                        const orderIdVal =
                          ord.id || ord.order_sn || ord.order_id;
                        return (
                          <div key={orderIdVal || oIdx} className="space-y-2.5">
                            <div className="flex justify-between items-center text-3xs font-mono text-[var(--aff-muted)] gap-2">
                              <span className="truncate max-w-[140px]">
                                {t('order_id_prefix', {
                                  id: orderIdVal || '—',
                                })}
                              </span>
                              <StatusBadge status={ord.order_status} />
                            </div>
                            <div className="space-y-3">
                              {ord.items?.map((item, itemIdx) => {
                                const imgVal =
                                  item.product?.image || item.img_code;
                                const nameVal =
                                  item.product?.name || item.item_name;
                                const commissionVal =
                                  item.product?.commission ||
                                  item.item_commission;
                                return (
                                  <div
                                    key={itemIdx}
                                    className="flex gap-2 items-start justify-between min-w-0"
                                  >
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
                                        <span className="text-4xs text-[var(--aff-muted)] block">
                                          {t('qty_prefix', {
                                            qty: item.qty ?? 0,
                                          })}{' '}
                                          • {formatPrice(item.actual_amount)}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-3xs font-bold text-amber-500 dark:text-amber-400 whitespace-nowrap flex-shrink-0">
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
            })}
          </div>

          {/* Pagination Controls */}
          {adminTotalPages > 0 && (
            <div className="flex items-center justify-between border-t border-[var(--aff-border)] pt-4 mt-4 text-xs">
              <span className="text-2xs text-[var(--aff-muted)]">
                {t('total_records_prefix', { total: adminTotal })}
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
                  {t('page_indicator_prefix', {
                    page: adminPage,
                    totalPages: adminTotalPages,
                  })}
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
