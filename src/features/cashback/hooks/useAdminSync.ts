'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { syncAdminOrders } from '@/features/cashback/api';
import { TOAST_ORANGE_PRESET } from '@/features/cashback/config';
import {
  dateToUnixSeconds,
  getCurrentDateStr,
  getStartOfCurrentMonthStr,
} from '@/features/cashback/utils';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Custom hook quản lý logic Form đồng bộ hóa đơn hàng thủ công từ Shopee API dành cho Quản trị viên.
 *
 * @param onSyncSuccess - Callback tùy chọn kích hoạt sau khi đồng bộ thành công.
 * @returns Đối tượng chứa các state ngày bắt đầu/kết thúc, subId, loading và handler kích hoạt đồng bộ.
 */
export function useAdminSync(onSyncSuccess?: () => void) {
  const t = useTranslations('cashback');
  const { custom: showCustomToast, error: showErrorToast } = useToast();
  const { token, user } = useAuth();
  const userRole = user?.role;

  const [syncStart, setSyncStart] = React.useState(getStartOfCurrentMonthStr());
  const [syncEnd, setSyncEnd] = React.useState(getCurrentDateStr());
  const [syncSubId, setSyncSubId] = React.useState('');
  const [syncLoading, setSyncLoading] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = React.useState(false);

  const handleAdminSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || userRole !== 'admin') return;

    setSyncLoading(true);
    setSyncMessage(null);
    setSyncSuccess(false);

    const sTime = dateToUnixSeconds(syncStart);
    const eTime = dateToUnixSeconds(syncEnd, true);

    try {
      const res = await syncAdminOrders(token, {
        purchase_time_s: sTime,
        purchase_time_e: eTime,
        sub_id: syncSubId || undefined,
      });

      if (res.ok) {
        setSyncSuccess(true);
        setSyncMessage(t('sync.success'));
        showCustomToast(t('toasts.admin_sync_success'), TOAST_ORANGE_PRESET);
        onSyncSuccess?.();
      } else {
        setSyncSuccess(false);
        setSyncMessage(t('sync.error'));
        showErrorToast(t('toasts.sync_failed'));
      }
    } catch (err) {
      console.error(err);
      setSyncSuccess(false);
      setSyncMessage(t('sync.error'));
      showErrorToast(t('toasts.sync_failed'));
    } finally {
      setSyncLoading(false);
    }
  };

  return {
    syncStart,
    setSyncStart,
    syncEnd,
    setSyncEnd,
    syncSubId,
    setSyncSubId,
    syncLoading,
    syncMessage,
    syncSuccess,
    handleAdminSync,
  };
}
