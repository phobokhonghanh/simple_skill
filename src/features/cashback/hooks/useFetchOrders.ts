'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  getUserCashbacks,
  getAdminCashbacks,
  getAdminShopeeConversions,
} from '@/features/cashback/api';
import type {
  CashbackRecord,
  ConversionRecord,
  Pagination,
} from '@/features/cashback/types';
import { DEFAULT_PAGE_SIZE } from '@/features/cashback/config';
import {
  getCurrentDateStr,
  getThirtyDaysAgoStr,
  dateToUnixSeconds,
} from '@/features/cashback/utils';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';

/** Options tham số truyền vào hook useFetchOrders */
export interface UseFetchOrdersOptions {
  /** Token xác thực tùy chỉnh (nếu rỗng sẽ tự lấy từ AuthContext) */
  token?: string | null;
  /** Vai trò người dùng ('user' hoặc 'admin') */
  role?: 'user' | 'admin';
  /** Đối tượng dữ liệu cần nạp ('cashbacks' hoặc 'conversions') */
  target?: 'cashbacks' | 'conversions';
  /** Ngày bắt đầu ban đầu (YYYY-MM-DD) */
  initialStartDate?: string;
  /** Ngày kết thúc ban đầu (YYYY-MM-DD) */
  initialEndDate?: string;
  /** Sub ID lọc đối soát (cho Admin) */
  subId?: string;
  /** User ID lọc (cho Admin) */
  userId?: string;
}

/**
 * Custom hook dùng chung cho cả User và Admin để nạp dữ liệu danh sách đơn hàng hoàn tiền hoặc đơn đối soát Shopee.
 * Tự động đồng bộ với AuthContext, xử lý lọc theo ngày, phân trang và thông báo lỗi.
 *
 * @param options - UseFetchOrdersOptions bao gồm token, role, target, ngày bắt đầu/kết thúc và các tham số lọc.
 * @returns Đối tượng chứa dữ liệu data, trạng thái loading, error, pagination và các setter lọc.
 */
export function useFetchOrders<T = CashbackRecord | ConversionRecord>({
  token: explicitToken,
  role = 'user',
  target = 'cashbacks',
  initialStartDate,
  initialEndDate,
  subId,
  userId,
}: UseFetchOrdersOptions = {}) {
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { error: showErrorToast } = useToast();
  const { token: contextToken } = useAuth();
  const token = explicitToken ?? contextToken;

  const showErrorToastRef = React.useRef(showErrorToast);
  React.useEffect(() => {
    showErrorToastRef.current = showErrorToast;
  }, [showErrorToast]);

  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [page, setPage] = React.useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;

  const [pagination, setPagination] = React.useState<Pagination>({
    page: 1,
    pageSize,
    total: 0,
    totalPages: 0,
  });

  const [startDate, setStartDate] = React.useState(
    initialStartDate || getThirtyDaysAgoStr(),
  );
  const [endDate, setEndDate] = React.useState(
    initialEndDate || getCurrentDateStr(),
  );

  const fetchOrders = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const startTimeSeconds = dateToUnixSeconds(startDate);
    const endTimeSeconds = dateToUnixSeconds(endDate, true);

    try {
      let res;
      if (role === 'admin') {
        if (target === 'conversions') {
          res = await getAdminShopeeConversions(token, {
            page_num: page,
            page_size: pageSize,
            purchase_time_s: startTimeSeconds,
            purchase_time_e: endTimeSeconds,
            sub_id: subId || undefined,
          });
        } else {
          res = await getAdminCashbacks(token, {
            page,
            pageSize,
            userId: userId || undefined,
          });
        }
      } else {
        res = await getUserCashbacks(token, {
          page,
          pageSize,
          purchase_time_s: startTimeSeconds,
          purchase_time_e: endTimeSeconds,
        });
      }

      if (res && res.ok && Array.isArray(res.data)) {
        setData(res.data as T[]);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({
            page,
            pageSize,
            total: res.data.length,
            totalPages: 1,
          });
        }
      } else {
        const errMsg =
          res && typeof res === 'object' && 'code' in res && res.code === 'auth_required'
            ? tAuth('protected.require_login')
            : tCommon('errors.not_found');
        setError(errMsg);
        showErrorToastRef.current(errMsg);
      }
    } catch {
      const errMsg = tCommon('errors.not_found');
      setError(errMsg);
      showErrorToastRef.current(errMsg);
    } finally {
      setLoading(false);
    }
  }, [
    token,
    role,
    target,
    startDate,
    endDate,
    page,
    pageSize,
    subId,
    userId,
    tCommon,
    tAuth,
  ]);

  React.useEffect(() => {
    let isMounted = true;
    if (token) {
      Promise.resolve().then(() => {
        if (isMounted) {
          void fetchOrders();
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [token, fetchOrders]);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    pagination,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchOrders,
  };
}
