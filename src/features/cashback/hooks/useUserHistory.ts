'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  getUserCashbacks,
  getUserShopeeConversions,
} from '@/features/cashback/api';
import type {
  CashbackRecord,
  ConversionRecord,
} from '@/features/cashback/types';
import { dateToUnixSeconds } from '@/features/cashback/utils';

const getStartOfCurrentMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

const getCurrentDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function useUserHistory(token: string | null, activeTab: string) {
  const t = useTranslations('cashback');
  const [cashbackHistory, setCashbackHistory] = React.useState<
    CashbackRecord[]
  >([]);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [historyError, setHistoryError] = React.useState<string | null>(null);
  const [expandedRecordId, setExpandedRecordId] = React.useState<string | null>(
    null,
  );

  // User Sync states
  const [userSyncLoading, setUserSyncLoading] = React.useState(false);
  const [userSyncSuccess, setUserSyncSuccess] = React.useState(false);
  const [userSyncMessage, setUserSyncMessage] = React.useState<string | null>(
    null,
  );
  const [userSyncData, setUserSyncData] = React.useState<
    ConversionRecord[] | null
  >(null);
  const [showUserSyncModal, setShowUserSyncModal] = React.useState(false);

  // Pagination & Date Filters
  const [userHistoryPage, setUserHistoryPage] = React.useState(1);
  const userHistoryPageSize = 20;
  const [userHistoryTotal, setUserHistoryTotal] = React.useState(0);
  const [userHistoryTotalPages, setUserHistoryTotalPages] = React.useState(0);

  const [historyStart, setHistoryStart] = React.useState(
    getStartOfCurrentMonthStr(),
  );
  const [historyEnd, setHistoryEnd] = React.useState(getCurrentDateStr());

  // UI Filters (Local, no API calls)
  const [filterPlatform, setFilterPlatform] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [sortByTime, setSortByTime] = React.useState<'desc' | 'asc'>('desc');

  const handleUserSync = React.useCallback(
    async (startDate: string, endDate: string) => {
      if (!token) return;
      setUserSyncLoading(true);
      setUserSyncSuccess(false);
      setUserSyncMessage(null);
      setUserSyncData(null);
      setShowUserSyncModal(true);

      const sTime = dateToUnixSeconds(startDate);
      const eTime = dateToUnixSeconds(endDate, true);

      if (sTime === undefined || eTime === undefined) {
        setUserSyncMessage(t('invalid_date') || 'Ngày tháng không hợp lệ');
        setUserSyncLoading(false);
        return;
      }

      try {
        const res = await getUserShopeeConversions(token, {
          purchase_time_s: sTime,
          purchase_time_e: eTime,
        });

        if (res.ok && res.data) {
          setUserSyncSuccess(true);
          setUserSyncData(res.data);
        } else {
          setUserSyncSuccess(false);
          setUserSyncMessage(
            t('sync_error') || 'Có lỗi xảy ra khi đồng bộ đơn hàng',
          );
        }
      } catch {
        setUserSyncSuccess(false);
        setUserSyncMessage(
          t('sync_error') || 'Có lỗi xảy ra khi đồng bộ đơn hàng',
        );
      } finally {
        setUserSyncLoading(false);
      }
    },
    [token, t],
  );

  const fetchUserHistory = React.useCallback(async () => {
    if (!token) return;
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const sTime = dateToUnixSeconds(historyStart);
      const eTime = dateToUnixSeconds(historyEnd, true);
      const res = await getUserCashbacks(token, {
        page: userHistoryPage,
        pageSize: userHistoryPageSize,
        purchase_time_s: sTime,
        purchase_time_e: eTime,
      });
      if (res.ok && res.data) {
        setCashbackHistory(res.data);
        if (res.pagination) {
          setUserHistoryTotal(res.pagination.total);
          setUserHistoryTotalPages(res.pagination.totalPages);
        } else {
          setUserHistoryTotal(res.data.length);
          setUserHistoryTotalPages(1);
        }
      } else {
        setHistoryError(t('not_found'));
      }
    } catch {
      setHistoryError(t('not_found'));
    } finally {
      setLoadingHistory(false);
    }
  }, [token, historyStart, historyEnd, userHistoryPage, t]);

  React.useEffect(() => {
    if (activeTab === 'history' && token) {
      const timer = setTimeout(() => {
        void fetchUserHistory();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, token, fetchUserHistory]);

  const processedUserHistory = React.useMemo(() => {
    let result = [...cashbackHistory];

    if (filterPlatform !== 'all') {
      result = result.filter(
        (rec) => rec.platform?.toLowerCase() === filterPlatform.toLowerCase(),
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(
        (rec) => rec.status?.toLowerCase() === filterStatus.toLowerCase(),
      );
    }

    result.sort((a, b) => {
      const timeA =
        a.conversion?.purchase_time ??
        (a.createdAt ? new Date(a.createdAt).getTime() / 1000 : 0);
      const timeB =
        b.conversion?.purchase_time ??
        (b.createdAt ? new Date(b.createdAt).getTime() / 1000 : 0);
      return sortByTime === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [cashbackHistory, filterPlatform, filterStatus, sortByTime]);

  const uiTotalCashback = React.useMemo(() => {
    return processedUserHistory.reduce(
      (acc, rec) => acc + (rec.cashback || 0),
      0,
    );
  }, [processedUserHistory]);

  return {
    cashbackHistory,
    loadingHistory,
    historyError,
    expandedRecordId,
    setExpandedRecordId,
    userHistoryPage,
    setUserHistoryPage,
    userHistoryTotal,
    userHistoryTotalPages,
    historyStart,
    setHistoryStart,
    historyEnd,
    setHistoryEnd,
    filterPlatform,
    setFilterPlatform,
    filterStatus,
    setFilterStatus,
    sortByTime,
    setSortByTime,
    fetchUserHistory,
    processedUserHistory,
    uiTotalCashback,
    setCashbackHistory,
    userSyncLoading,
    userSyncSuccess,
    userSyncMessage,
    setUserSyncMessage,
    userSyncData,
    setUserSyncData,
    showUserSyncModal,
    setShowUserSyncModal,
    handleUserSync,
  };
}
