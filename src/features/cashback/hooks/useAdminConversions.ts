'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { getAdminShopeeConversions } from '@/features/cashback/api';
import type { ConversionRecord } from '@/features/cashback/types';
import { DEFAULT_PAGE_SIZE } from '@/features/cashback/config';
import {
  dateToUnixSeconds,
  getCurrentDateStr,
  getStartOfCurrentMonthStr,
} from '@/features/cashback/utils';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Custom hook quản lý dữ liệu danh sách báo cáo đơn chuyển đổi đối soát Shopee dành cho Quản trị viên (Admin).
 *
 * @returns Đối tượng chứa danh sách đơn đối soát, trạng thái loading, lỗi, phân trang và handler tra cứu.
 */
export function useAdminConversions() {
  const tCommon = useTranslations('common');
  const { token, user } = useAuth();
  const userRole = user?.role;

  const [conversions, setConversions] = React.useState<ConversionRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  const [filterSubId, setFilterSubId] = React.useState('');
  const [filterStart, setFilterStart] = React.useState(
    getStartOfCurrentMonthStr(),
  );
  const [filterEnd, setFilterEnd] = React.useState(getCurrentDateStr());

  const fetchConversions = React.useCallback(async () => {
    if (!token || userRole !== 'admin') return;
    setLoading(true);
    setError(null);

    const sTime = dateToUnixSeconds(filterStart);
    const eTime = dateToUnixSeconds(filterEnd, true);

    try {
      const res = await getAdminShopeeConversions(token, {
        page_num: page,
        page_size: pageSize,
        sub_id: filterSubId || undefined,
        purchase_time_s: sTime,
        purchase_time_e: eTime,
      });

      if (res.ok && res.data) {
        setConversions(res.data);
        if (res.pagination) {
          setTotal(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        } else {
          setTotal(res.data.length);
          setTotalPages(1);
        }
      } else {
        setConversions([]);
        setError(tCommon('errors.not_found'));
      }
    } catch {
      setConversions([]);
      setError(tCommon('errors.not_found'));
    } finally {
      setLoading(false);
    }
  }, [token, userRole, filterStart, filterEnd, filterSubId, page, pageSize, tCommon]);

  React.useEffect(() => {
    let isMounted = true;
    if (token && userRole === 'admin') {
      Promise.resolve().then(() => {
        if (isMounted) {
          void fetchConversions();
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [token, userRole, fetchConversions]);

  return {
    conversions,
    loading,
    error,
    page,
    setPage,
    total,
    totalPages,
    filterSubId,
    setFilterSubId,
    filterStart,
    setFilterStart,
    filterEnd,
    setFilterEnd,
    fetchConversions,
    setConversions,
  };
}
