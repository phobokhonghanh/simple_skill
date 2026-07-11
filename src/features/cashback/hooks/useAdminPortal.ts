'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { getShopeeConversions, getAdminCashbacks, syncShopeeCashbacks } from '@/features/cashback/api';
import type { ConversionRecord, CashbackRecord } from '@/features/cashback/types';
import { dateToUnixSeconds } from '@/features/cashback/utils';

export function useAdminPortal(token: string | null, userRole: string | undefined, activeTab: string) {
  const t = useTranslations('cashback');

  // Admin Sub-Tab: 'conversions' | 'cashbacks'
  const [adminSubTab, setAdminSubTab] = React.useState<'conversions' | 'cashbacks'>('conversions');

  // Sync parameters
  const [syncStart, setSyncStart] = React.useState('');
  const [syncEnd, setSyncEnd] = React.useState('');
  const [syncSubId, setSyncSubId] = React.useState('');
  const [syncLoading, setSyncLoading] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = React.useState(false);

  // Admin Conversions List States
  const [adminConversions, setAdminConversions] = React.useState<ConversionRecord[]>([]);
  const [loadingAdminConversions, setLoadingAdminConversions] = React.useState(false);
  const [adminError, setAdminError] = React.useState<string | null>(null);
  const [adminPage, setAdminPage] = React.useState(1);
  const adminPageSize = 20;
  const [adminTotal, setAdminTotal] = React.useState(0);
  const [adminTotalPages, setAdminTotalPages] = React.useState(0);
  const [expandedAdminRecordId, setExpandedAdminRecordId] = React.useState<string | null>(null);

  // Admin Filters for conversions
  const [filterSubId, setFilterSubId] = React.useState('');
  const [filterStart, setFilterStart] = React.useState('');
  const [filterEnd, setFilterEnd] = React.useState('');

  // Admin Cashbacks List States
  const [adminCashbacks, setAdminCashbacks] = React.useState<CashbackRecord[]>([]);
  const [loadingAdminCashbacks, setLoadingAdminCashbacks] = React.useState(false);
  const [adminCashbacksError, setAdminCashbacksError] = React.useState<string | null>(null);
  const [adminCashbacksPage, setAdminCashbacksPage] = React.useState(1);
  const [adminCashbacksTotal, setAdminCashbacksTotal] = React.useState(0);
  const [adminCashbacksTotalPages, setAdminCashbacksTotalPages] = React.useState(0);
  const [searchUserId, setSearchUserId] = React.useState('');

  // Admin conversions report query
  const fetchAdminConversions = React.useCallback(async () => {
    if (!token || userRole !== 'admin') return;
    setLoadingAdminConversions(true);
    setAdminError(null);

    const sTime = dateToUnixSeconds(filterStart);
    const eTime = dateToUnixSeconds(filterEnd, true);

    try {
      const res = await getShopeeConversions(token, {
        page_num: adminPage,
        page_size: adminPageSize,
        sub_id: filterSubId || undefined,
        purchase_time_s: sTime,
        purchase_time_e: eTime,
      });

      if (res.ok && res.data) {
        setAdminConversions(res.data.list);
        setAdminTotal(res.data.total_count);
        setAdminTotalPages(Math.ceil(res.data.total_count / adminPageSize));
      } else {
        setAdminError(t('not_found'));
      }
    } catch {
      setAdminError(t('not_found'));
    } finally {
      setLoadingAdminConversions(false);
    }
  }, [token, userRole, filterStart, filterEnd, filterSubId, adminPage, adminPageSize, t]);

  // Admin cashbacks records query
  const fetchAdminCashbacks = React.useCallback(async () => {
    if (!token || userRole !== 'admin') return;
    setLoadingAdminCashbacks(true);
    setAdminCashbacksError(null);
    try {
      const res = await getAdminCashbacks(token, {
        page: adminCashbacksPage,
        pageSize: 20,
        userId: searchUserId.trim() || undefined,
      });
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
        setAdminCashbacksError(t('not_found'));
      }
    } catch {
      setAdminCashbacksError(t('not_found'));
    } finally {
      setLoadingAdminCashbacks(false);
    }
  }, [token, userRole, adminCashbacksPage, searchUserId, t]);

  // Fetch admin data on tab change
  React.useEffect(() => {
    if (activeTab === 'admin' && token && userRole === 'admin') {
      const timer = setTimeout(() => {
        if (adminSubTab === 'conversions') {
          void fetchAdminConversions();
        } else {
          void fetchAdminCashbacks();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, token, userRole, adminSubTab, fetchAdminConversions, fetchAdminCashbacks]);

  // Admin Manual Sync
  const handleAdminSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || userRole !== 'admin') return;

    setSyncLoading(true);
    setSyncMessage(null);
    setSyncSuccess(false);

    const sTime = dateToUnixSeconds(syncStart);
    const eTime = dateToUnixSeconds(syncEnd, true);

    try {
      const res = await syncShopeeCashbacks(token, {
        purchase_time_s: sTime,
        purchase_time_e: eTime,
        sub_id: syncSubId || undefined,
      });

      if (res.ok) {
        setSyncSuccess(true);
        setSyncMessage(t('sync_success'));
        void fetchAdminConversions(); // refresh list
      } else {
        setSyncSuccess(false);
        setSyncMessage(t('sync_error'));
      }
    } catch {
      setSyncSuccess(false);
      setSyncMessage(t('sync_error'));
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
    expandedAdminRecordId,
    setExpandedAdminRecordId,
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
