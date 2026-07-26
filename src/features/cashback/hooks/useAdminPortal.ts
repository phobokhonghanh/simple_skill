'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  getAdminShopeeConversions,
  getAdminCashbacks,
  syncAdminOrders,
} from '@/features/cashback/api';
import type {
  ConversionRecord,
  CashbackRecord,
  AdminSubTab,
  UserRole,
  CashbackTab,
} from '@/features/cashback/types';
import {
  DEFAULT_PAGE_SIZE,
  TOAST_ORANGE_PRESET,
} from '@/features/cashback/config';
import {
  dateToUnixSeconds,
  getCurrentDateStr,
  getStartOfCurrentMonthStr,
} from '@/features/cashback/utils';
import { useToast } from '@/components/providers/ToastProvider';

/**
 * Custom hook quản lý toàn bộ các tính năng dành cho Quản trị viên (Admin Portal).
 * Bao gồm đồng bộ thủ công đơn hàng từ Shopee API, tra cứu danh sách đơn chuyển đổi đối soát và quản lý danh sách Cashback của người dùng.
 *
 * @param token - Token xác thực Admin.
 * @param userRole - Quyền hạn tài khoản hiện tại ('admin' hoặc 'user').
 * @param activeTab - Tab trang Cashback đang hoạt động.
 * @returns Đối tượng chứa toàn bộ state và các hàm handler thao tác của Admin Portal.
 */
export function useAdminPortal(
  token: string | null,
  userRole: UserRole | undefined,
  activeTab: CashbackTab,
) {
  const t = useTranslations('cashback');
  const tCommon = useTranslations('common');
  const { custom: showCustomToast, error: showErrorToast } = useToast();

  const [adminSubTab, setAdminSubTab] =
    React.useState<AdminSubTab>('conversions');

  const [syncStart, setSyncStart] = React.useState(getStartOfCurrentMonthStr());
  const [syncEnd, setSyncEnd] = React.useState(getCurrentDateStr());
  const [syncSubId, setSyncSubId] = React.useState('');
  const [syncLoading, setSyncLoading] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = React.useState(false);

  const [adminConversions, setAdminConversions] = React.useState<
    ConversionRecord[]
  >([]);
  const [loadingAdminConversions, setLoadingAdminConversions] =
    React.useState(false);
  const [adminError, setAdminError] = React.useState<string | null>(null);
  const [adminPage, setAdminPage] = React.useState(1);
  const adminPageSize = DEFAULT_PAGE_SIZE;
  const [adminTotal, setAdminTotal] = React.useState(0);
  const [adminTotalPages, setAdminTotalPages] = React.useState(0);

  const [filterSubId, setFilterSubId] = React.useState('');
  const [filterStart, setFilterStart] = React.useState(
    getStartOfCurrentMonthStr(),
  );
  const [filterEnd, setFilterEnd] = React.useState(getCurrentDateStr());

  const [adminCashbacks, setAdminCashbacks] = React.useState<CashbackRecord[]>(
    [],
  );
  const [loadingAdminCashbacks, setLoadingAdminCashbacks] =
    React.useState(false);
  const [adminCashbacksError, setAdminCashbacksError] = React.useState<
    string | null
  >(null);
  const [adminCashbacksPage, setAdminCashbacksPage] = React.useState(1);
  const [adminCashbacksTotal, setAdminCashbacksTotal] = React.useState(0);
  const [adminCashbacksTotalPages, setAdminCashbacksTotalPages] =
    React.useState(0);
  const [searchUserId, setSearchUserId] = React.useState('');
  const [adminCashbacksLoaded, setAdminCashbacksLoaded] = React.useState(false);

  const fetchAdminConversions = React.useCallback(async () => {
    if (!token || userRole !== 'admin') return;
    setLoadingAdminConversions(true);
    setAdminError(null);

    const sTime = dateToUnixSeconds(filterStart);
    const eTime = dateToUnixSeconds(filterEnd, true);

    try {
      const res = await getAdminShopeeConversions(token, {
        page_num: adminPage,
        page_size: adminPageSize,
        sub_id: filterSubId || undefined,
        purchase_time_s: sTime,
        purchase_time_e: eTime,
      });

      if (res.ok && res.data) {
        setAdminConversions(res.data);
        if (res.pagination) {
          setAdminTotal(res.pagination.total);
          setAdminTotalPages(res.pagination.totalPages);
        } else {
          setAdminTotal(res.data.length);
          setAdminTotalPages(1);
        }
      } else {
        setAdminConversions([]);
        setAdminError(tCommon('errors.not_found'));
      }
    } catch {
      setAdminConversions([]);
      setAdminError(tCommon('errors.not_found'));
    } finally {
      setLoadingAdminConversions(false);
    }
  }, [
    token,
    userRole,
    filterStart,
    filterEnd,
    filterSubId,
    adminPage,
    adminPageSize,
    tCommon,
  ]);

  const fetchAdminCashbacks = React.useCallback(async () => {
    if (!token || userRole !== 'admin') return;
    setLoadingAdminCashbacks(true);
    setAdminCashbacksError(null);
    try {
      const res = await getAdminCashbacks(token, {
        page: adminCashbacksPage,
        pageSize: DEFAULT_PAGE_SIZE,
        userId: searchUserId.trim() || undefined,
      });
      setAdminCashbacksLoaded(true);
      if (res.ok && res.data) {
        setAdminCashbacks(res.data);
        if (res.pagination) {
          setAdminCashbacksTotal(res.pagination.total);
          setAdminCashbacksTotalPages(res.pagination.totalPages);
        } else {
          setAdminCashbacksTotal(res.data.length);
          setAdminCashbacksTotalPages(1);
        }
      } else {
        setAdminCashbacksError(tCommon('errors.not_found'));
      }
    } catch {
      setAdminCashbacksError(tCommon('errors.not_found'));
    } finally {
      setLoadingAdminCashbacks(false);
    }
  }, [token, userRole, adminCashbacksPage, searchUserId, tCommon]);

  React.useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    if (activeTab === 'admin' && token && userRole === 'admin') {
      if (adminSubTab === 'cashbacks' && !adminCashbacksLoaded) {
        timer = setTimeout(() => {
          if (isMounted) {
            void fetchAdminCashbacks();
          }
        }, 0);
      }
    }
    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [
    activeTab,
    token,
    userRole,
    adminSubTab,
    adminCashbacksLoaded,
    fetchAdminCashbacks,
  ]);

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
        void fetchAdminConversions();
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
    adminSubTab,
    setAdminSubTab,
    syncStart,
    setSyncStart,
    syncEnd,
    setSyncEnd,
    syncSubId,
    setSyncSubId,
    syncLoading,
    syncMessage,
    syncSuccess,
    setSyncMessage,
    adminConversions,
    loadingAdminConversions,
    adminError,
    adminPage,
    setAdminPage,
    adminTotal,
    adminTotalPages,
    filterSubId,
    setFilterSubId,
    filterStart,
    setFilterStart,
    filterEnd,
    setFilterEnd,
    adminCashbacks,
    loadingAdminCashbacks,
    adminCashbacksError,
    adminCashbacksPage,
    setAdminCashbacksPage,
    adminCashbacksTotal,
    adminCashbacksTotalPages,
    searchUserId,
    setSearchUserId,
    fetchAdminConversions,
    fetchAdminCashbacks,
    handleAdminSync,
    setAdminConversions,
    setAdminCashbacks,
  };
}

/** Type định nghĩa dữ liệu trả về từ hook useAdminPortal */
export type AdminPortalState = ReturnType<typeof useAdminPortal>;
