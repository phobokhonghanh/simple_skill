'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { getAdminCashbacks } from '@/features/cashback/api';
import type { CashbackRecord } from '@/features/cashback/types';
import { DEFAULT_PAGE_SIZE } from '@/features/cashback/config';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Custom hook quản lý dữ liệu danh sách Cashback hoàn tiền người dùng dành cho Quản trị viên (Admin).
 *
 * @returns Đối tượng chứa danh sách cashback, trạng thái loading, lỗi, phân trang và handler tra cứu theo userId.
 */
export function useAdminCashbacks() {
  const tCommon = useTranslations('common');
  const { token, user } = useAuth();
  const userRole = user?.role;

  const [cashbacks, setCashbacks] = React.useState<CashbackRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [searchUserId, setSearchUserId] = React.useState('');

  const fetchCashbacks = React.useCallback(async () => {
    if (!token || userRole !== 'admin') return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminCashbacks(token, {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        userId: searchUserId.trim() || undefined,
      });
      if (res.ok && res.data) {
        setCashbacks(res.data);
        if (res.pagination) {
          setTotal(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        } else {
          setTotal(res.data.length);
          setTotalPages(1);
        }
      } else {
        setError(tCommon('errors.not_found'));
      }
    } catch {
      setError(tCommon('errors.not_found'));
    } finally {
      setLoading(false);
    }
  }, [token, userRole, page, searchUserId, tCommon]);

  React.useEffect(() => {
    let isMounted = true;
    if (token && userRole === 'admin') {
      Promise.resolve().then(() => {
        if (isMounted) {
          void fetchCashbacks();
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [token, userRole, fetchCashbacks]);

  return {
    cashbacks,
    loading,
    error,
    page,
    setPage,
    total,
    totalPages,
    searchUserId,
    setSearchUserId,
    fetchCashbacks,
    setCashbacks,
  };
}
