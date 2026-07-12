'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  Loader2,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { CashbackRecord } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice, formatDate } from '@/features/cashback/utils';
import { StatusBadge } from '@/features/cashback/StatusBadge';

interface AdminCashbacksViewProps {
  adminCashbacks: CashbackRecord[];
  loadingAdminCashbacks: boolean;
  adminCashbacksError: string | null;
  adminCashbacksPage: number;
  setAdminCashbacksPage: React.Dispatch<React.SetStateAction<number>>;
  adminCashbacksTotal: number;
  adminCashbacksTotalPages: number;
  searchUserId: string;
  setSearchUserId: (s: string) => void;
  fetchAdminCashbacks: () => void;
}

export function AdminCashbacksView({
  adminCashbacks,
  loadingAdminCashbacks,
  adminCashbacksError,
  adminCashbacksPage,
  setAdminCashbacksPage,
  adminCashbacksTotal,
  adminCashbacksTotalPages,
  searchUserId,
  setSearchUserId,
  fetchAdminCashbacks,
}: AdminCashbacksViewProps) {
  const t = useTranslations('cashback');

  return (
    <Card className="aff-card p-4 sm:p-5 rounded-2xl max-w-full overflow-hidden border-0 bg-transparent py-0 gap-0 shadow-none">
      <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2 border-b border-[var(--aff-border)] pb-3 mb-5">
        <CircleDollarSign className="w-5 h-5 text-orange-500" />
        <span>{t('admin_cashbacks_subtab')}</span>
      </h3>

      {/* Search filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-end mb-6 text-left">
        <div className="space-y-1.5 flex-1 w-full">
          <label className="text-2xs font-bold text-[var(--aff-muted)] block">
            {t('search_user_id')}
          </label>
          <input
            type="text"
            placeholder={t('search_user_id')}
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="aff-input w-full px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto font-bold">
          <Button
            onClick={() => {
              setAdminCashbacksPage(1);
              void fetchAdminCashbacks();
            }}
            className="flex-1 sm:flex-initial aff-btn-primary py-1.5 px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1 font-bold"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('search')}</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchUserId('');
              setAdminCashbacksPage(1);
              setTimeout(() => {
                void fetchAdminCashbacks();
              }, 0);
            }}
            className="flex-1 sm:flex-initial bg-neutral-200 dark:bg-neutral-800 text-[var(--aff-text)] hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1.5 px-4 rounded-xl text-xs cursor-pointer font-bold hover:bg-transparent"
          >
            {t('clear')}
          </Button>
        </div>
      </div>

      {loadingAdminCashbacks ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-[var(--aff-orange)] animate-spin" />
          <p className="text-xs text-[var(--aff-muted)]">{t('loading')}</p>
        </div>
      ) : adminCashbacksError ? (
        <div className="py-8 text-center text-red-500 text-xs sm:text-sm">{adminCashbacksError}</div>
      ) : adminCashbacks.length === 0 ? (
        <div className="py-12 text-center text-xs sm:text-sm text-[var(--aff-muted)] border border-dashed border-[var(--aff-border)] rounded-xl">
          {t('empty_cashbacks')}
        </div>
      ) : (
        <div className="space-y-4 max-w-full overflow-hidden">
          {/* Web View Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--aff-border)] text-[var(--aff-muted)] font-semibold">
                  <th className="py-3 px-2">{t('table_date')}</th>
                  <th className="py-3 px-2">{t('table_user_id')}</th>
                  <th className="py-3 px-2">{t('table_checkout_id')}</th>
                  <th className="py-3 px-2">{t('table_platform')}</th>
                  <th className="py-3 px-2">{t('table_cashback')}</th>
                  <th className="py-3 px-2 text-right">{t('table_status')}</th>
                </tr>
              </thead>
              <tbody>
                {adminCashbacks.map((rec) => {
                  const dateStr = formatDate(rec.createdAt);
                  const isShopee = rec.platform?.toLowerCase() === 'shopee';
                  return (
                    <tr
                      key={rec.id}
                      className="border-b border-[var(--aff-border)] hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      <td className="py-4 px-2">{dateStr}</td>
                      <td className="py-4 px-2 font-bold font-mono text-2xs truncate max-w-[120px]">
                        {rec.userId}
                      </td>
                      <td className="py-4 px-2 font-mono text-2xs truncate max-w-[120px]">
                        {rec.checkoutId}
                      </td>
                      <td className={`py-4 px-2 uppercase font-bold text-2xs ${isShopee ? 'text-[var(--aff-orange)]' : 'text-[var(--aff-text)]'}`}>
                        {rec.platform}
                      </td>
                      <td className="py-4 px-2 font-bold text-amber-500 dark:text-amber-400">
                        {formatPrice(rec.cashback)}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <StatusBadge status={rec.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View Card List */}
          <div className="sm:hidden space-y-4 max-w-full overflow-hidden">
            {adminCashbacks.map((rec) => {
              const dateStr = formatDate(rec.createdAt);
              const isShopee = rec.platform?.toLowerCase() === 'shopee';
              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-[var(--aff-border)] bg-neutral-50/30 dark:bg-neutral-900/10 space-y-2 text-left max-w-full overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-3xs text-[var(--aff-muted)] font-bold">{t('user_prefix', { id: rec.userId })}</p>
                      <p className="text-2xs font-mono text-[var(--aff-muted)] truncate max-w-[140px] break-all">
                        {t('checkout_prefix', { id: rec.checkoutId })}
                      </p>
                      <p className="text-3xs text-[var(--aff-muted)] mt-0.5">{dateStr}</p>
                    </div>
                    <StatusBadge status={rec.status} />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--aff-border)] text-xs">
                    <span className="uppercase text-3xs font-bold text-[var(--aff-muted)]">
                      {t('table_platform')}:{' '}
                      <span className={isShopee ? 'text-[var(--aff-orange)] font-extrabold' : 'text-[var(--aff-text)]'}>
                        {rec.platform}
                      </span>
                    </span>
                    <span className="font-bold text-amber-500 dark:text-amber-400">
                      {formatPrice(rec.cashback)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {adminCashbacksTotalPages > 0 && (
            <div className="flex items-center justify-between border-t border-[var(--aff-border)] pt-4 mt-4">
              <span className="text-2xs text-[var(--aff-muted)]">
                {t('total_records_prefix', { total: adminCashbacksTotal })}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={adminCashbacksPage <= 1}
                  onClick={() => {
                    setAdminCashbacksPage((p) => Math.max(1, p - 1));
                    setTimeout(() => void fetchAdminCashbacks(), 0);
                  }}
                  className="p-1.5 rounded-lg border border-[var(--aff-border)] text-[var(--aff-muted)] hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-40 cursor-pointer hover:bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-2xs px-2 font-semibold">
                  {t('page_indicator_prefix', { page: adminCashbacksPage, totalPages: adminCashbacksTotalPages })}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={adminCashbacksPage >= adminCashbacksTotalPages}
                  onClick={() => {
                    setAdminCashbacksPage((p) => Math.min(adminCashbacksTotalPages, p + 1));
                    setTimeout(() => void fetchAdminCashbacks(), 0);
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
