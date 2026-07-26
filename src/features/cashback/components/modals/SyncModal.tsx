'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  formatDateString,
  dateToUnixSeconds,
  mapConversionToCashbackRecord,
} from '@/features/cashback/utils';
import { CashbackCard } from '@/features/cashback/components/cards/CashbackCard';
import { Container } from '@/components/ui/Container';
import { Loading } from '@/features/cashback/components/Loading';
import { syncUserOrders, syncAdminOrders } from '@/features/cashback/api';
import { useToast } from '@/components/providers/ToastProvider';
import { useAsyncAction } from '@/features/cashback/hooks';

export interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  startDate: string;
  endDate: string;
  role?: 'user' | 'admin';
  subId?: string;
  onSuccess?: () => void;
}

/**
 * Modal tự quản lý việc gọi API đồng bộ và kết quả hiển thị thông qua Toast Notification & Loading component.
 * Hỗ trợ tái sử dụng cho cả User & Admin.
 */
export function SyncModal({
  isOpen,
  onClose,
  token,
  startDate,
  endDate,
  role = 'user',
  subId,
  onSuccess,
}: SyncModalProps) {
  const t = useTranslations('cashback');
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [expandedSyncRecordId, setExpandedSyncRecordId] = React.useState<
    string | null
  >(null);

  const syncAction = useAsyncAction(
    React.useCallback(() => {
      if (!token) return Promise.resolve({ ok: false });
      if (role === 'admin') {
        const sTime = dateToUnixSeconds(startDate);
        const eTime = dateToUnixSeconds(endDate, true);
        return syncAdminOrders(token, {
          purchase_time_s: sTime,
          purchase_time_e: eTime,
          sub_id: subId || undefined,
        });
      }
      return syncUserOrders(token, { startDate, endDate });
    }, [token, role, startDate, endDate, subId]),
    {
      customErrorMessage: t('sync_modal.failed'),
      onSuccess: (data) => {
        showSuccessToast(
          t('sync_modal.success_prefix', { count: data?.length ?? 0 }),
        );
        onSuccess?.();
      },
      onError: (msg) => {
        showErrorToast(msg);
      },
    },
  );

  const { execute: executeSync, reset: resetSync } = syncAction;

  React.useEffect(() => {
    if (isOpen && token) {
      void executeSync();
    } else if (!isOpen) {
      resetSync();
    }
  }, [isOpen, token, executeSync, resetSync]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--aff-bg)] border border-[var(--aff-border)] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative overflow-hidden flex flex-col gap-4 text-left animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[var(--aff-border)] pb-3">
          <h4 className="font-extrabold text-sm sm:text-base text-[var(--aff-heading)] flex items-center gap-2">
            <RefreshCw
              className={`w-4 h-4 text-[var(--aff-orange)] ${syncAction.loading ? 'animate-spin' : ''}`}
            />
            <span>{t('sync_modal.title')}</span>
          </h4>
          {!syncAction.loading && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[var(--aff-muted)] hover:text-[var(--aff-text)] transition-colors p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <span className="text-xl font-bold leading-none">&times;</span>
            </button>
          )}
        </div>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-[var(--aff-border)] text-xs text-[var(--aff-muted)] space-y-1">
            <div>
              {t('sync_modal.range', {
                range: `${formatDateString(startDate)} - ${formatDateString(endDate)}`,
              })}
            </div>
          </div>

          {/* Dùng Container tự động xử lý loading, empty & content */}
          <Container
            loading={syncAction.loading}
            loadingFallback={<Loading variant="detailed" />}
            isEmpty={!syncAction.data?.length}
            emptyMessage={t('sync_modal.empty')}
          >
            <div className="max-h-[24rem] overflow-y-auto space-y-3 pr-1">
              {syncAction.data?.map((item, idx) => {
                const cashbackItem = mapConversionToCashbackRecord(item);
                const checkoutId = cashbackItem.checkoutId || `item-${idx}`;

                return (
                  <CashbackCard
                    key={checkoutId}
                    record={cashbackItem}
                    role={role}
                    isExpanded={expandedSyncRecordId === checkoutId}
                    onToggleExpand={() =>
                      setExpandedSyncRecordId(
                        expandedSyncRecordId === checkoutId ? null : checkoutId,
                      )
                    }
                  />
                );
              })}
            </div>
          </Container>
        </div>

        {!syncAction.loading && (
          <div className="border-t border-[var(--aff-border)] pt-3 flex justify-end">
            <Button
              onClick={onClose}
              className="bg-[var(--aff-orange)] hover:bg-[var(--aff-orange-hover)] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              {t('sync_modal.close')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
