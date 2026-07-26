'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversionsTable } from '@/features/cashback/components/tables/ConversionsTable';
import { ClientWrapper } from '@/components/ui/ClientWrapper';
import { OrderStats } from '@/features/cashback/components/OrderStats';
import { SyncModal } from '@/features/cashback/components/modals/SyncModal';
import { DateFilter } from '@/features/cashback/components/input/DateFilter';
import { useFetchOrders, useOrderStats } from '@/features/cashback/hooks';
import type { CashbackRecord } from '@/features/cashback/types';

export interface OrdersTabProps {
  token: string | null;
}

/**
 * Component hiển thị giao diện đối soát đơn hàng cá nhân của người dùng.
 * Trực tiếp sử dụng useFetchOrders (role='user') và useOrderStats.
 */
export function OrdersTab({ token }: OrdersTabProps) {
  const t = useTranslations('cashback');

  const ordersFetch = useFetchOrders<CashbackRecord>({ token, role: 'user' });
  const { totalCashback, sparklinePaths } = useOrderStats(ordersFetch.data);

  const [showSyncModal, setShowSyncModal] = React.useState(false);
  const [isNoteOpen, setIsNoteOpen] = React.useState(false);

  const handleSearchDate = (start: string, end: string) => {
    ordersFetch.setStartDate(start);
    ordersFetch.setEndDate(end);
    ordersFetch.setPage(1);
  };

  return (
    <ClientWrapper>
      <div className="space-y-6 max-w-full overflow-hidden">
        {/* Order Stats Component */}
        <OrderStats
          totalCashback={totalCashback}
          totalOrders={ordersFetch.pagination.total}
          sparklinePaths={sparklinePaths}
        />

        {/* Orders Table Container */}
        <div className="aff-card p-6 sm:p-8 rounded-2xl max-w-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--aff-border)] pb-4 mb-4">
            <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--aff-orange)]" />
              <span>{t('tabs.orders_details')}</span>
            </h3>
            <Button
              onClick={() => setShowSyncModal(true)}
              disabled={ordersFetch.loading}
              className="bg-[var(--aff-orange)] hover:bg-[var(--aff-orange-hover)] text-white font-bold text-xs py-1.5 px-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer h-9 shadow-sm shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('buttons.manual_sync')}</span>
            </Button>
          </div>

          {/* Reusable DateFilter */}
          <DateFilter
            startDate={ordersFetch.startDate}
            endDate={ordersFetch.endDate}
            onSearch={handleSearchDate}
            loading={ordersFetch.loading}
            className="mb-6"
          />

          {/* ConversionsTable nhận trực tiếp orders kiểu CashbackRecord[] và đối tượng pagination */}
          <ConversionsTable
            records={ordersFetch.data}
            loading={ordersFetch.loading}
            pagination={ordersFetch.pagination}
            onPageChange={ordersFetch.setPage}
          />

          {/* Instruction Note */}
          <div className="mt-6 border border-orange-500/20 dark:border-orange-500/10 rounded-2xl overflow-hidden bg-orange-500/5 dark:bg-orange-500/10">
            <button
              onClick={() => setIsNoteOpen(!isNoteOpen)}
              className="w-full flex items-center justify-between p-4 font-bold text-xs text-amber-600 dark:text-amber-400 hover:bg-orange-500/5 dark:hover:bg-orange-500/5 transition-all text-left cursor-pointer select-none"
            >
              <span>{t('manual_sync.title')}</span>
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
                    {t.rich('manual_sync.bullet1', {
                      b: (chunks) => (
                        <strong className="font-bold text-[var(--aff-text)]">
                          {chunks}
                        </strong>
                      ),
                    })}
                  </li>
                  <li>
                    {t.rich('manual_sync.bullet2', {
                      b: (chunks) => (
                        <strong className="font-bold text-[var(--aff-text)]">
                          {chunks}
                        </strong>
                      ),
                    })}
                  </li>
                  <li>
                    {t.rich('manual_sync.bullet3', {
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

        {/* Self-contained SyncModal */}
        <SyncModal
          isOpen={showSyncModal}
          onClose={() => setShowSyncModal(false)}
          token={token}
          startDate={ordersFetch.startDate}
          endDate={ordersFetch.endDate}
          onSuccess={() => void ordersFetch.fetchOrders()}
        />
      </div>
    </ClientWrapper>
  );
}
