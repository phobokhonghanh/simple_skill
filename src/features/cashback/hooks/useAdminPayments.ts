'use client';

import * as React from 'react';
import type { PaymentRecord, PaymentDetailRecord, ReconciliationSummary, PaymentStatus } from '@/features/cashback/types';
import {
  getAdminPayments,
  getAdminPaymentDetail,
  reconcilePayments,
  updateAdminPaymentStatus,
} from '@/features/cashback/api';

export function useAdminPayments(token: string | null) {
  const [payments, setPayments] = React.useState<PaymentRecord[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState('');
  const [userIdFilter, setUserIdFilter] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [reconciling, setReconciling] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [reconcileResult, setReconcileResult] = React.useState<ReconciliationSummary | null>(null);

  const lastFetchKeyRef = React.useRef<string>('');

  const fetchPayments = React.useCallback(
    async (p = page, status = statusFilter, uId = userIdFilter) => {
      if (!token) return;

      const fetchKey = `${token}_${p}_${status}_${uId}`;
      if (lastFetchKeyRef.current === fetchKey) return;
      lastFetchKeyRef.current = fetchKey;

      setLoading(true);
      try {
        const res = await getAdminPayments(token, {
          page: p,
          pageSize: 10,
          status: status || undefined,
          userId: uId.trim() || undefined,
        });
        if (res.ok && res.data) {
          setPayments(res.data);
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages || 1);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [token, page, statusFilter, userIdFilter],
  );

  React.useEffect(() => {
    if (token) {
      fetchPayments(page, statusFilter, userIdFilter);
    }
  }, [token, page, statusFilter, userIdFilter, fetchPayments]);

  const handleReconcile = async (): Promise<ReconciliationSummary | null> => {
    if (!token) return null;
    setReconciling(true);
    setReconcileResult(null);
    try {
      const res = await reconcilePayments(token);
      if (res.ok && res.data) {
        setReconcileResult(res.data);
        lastFetchKeyRef.current = '';
        fetchPayments(1, statusFilter, userIdFilter);
        return res.data;
      }
      return null;
    } finally {
      setReconciling(false);
    }
  };

  const handleUpdateStatus = async (
    paymentId: string,
    status: PaymentStatus,
  ): Promise<PaymentRecord | null> => {
    if (!token) return null;
    setUpdatingId(paymentId);
    try {
      const res = await updateAdminPaymentStatus(token, paymentId, status);
      if (res.ok) {
        lastFetchKeyRef.current = '';
        fetchPayments(page, statusFilter, userIdFilter);
        return res.data ?? null;
      }
      return null;
    } finally {
      setUpdatingId(null);
    }
  };

  const fetchDetail = async (id: string): Promise<PaymentDetailRecord | null> => {
    if (!token) return null;
    const res = await getAdminPaymentDetail(token, id);
    if (res.ok && res.data) {
      return res.data;
    }
    return null;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    lastFetchKeyRef.current = '';
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
    lastFetchKeyRef.current = '';
  };

  const handleUserIdFilterChange = (newUserId: string) => {
    setUserIdFilter(newUserId);
    setPage(1);
    lastFetchKeyRef.current = '';
  };

  return {
    payments,
    page,
    totalPages,
    statusFilter,
    userIdFilter,
    loading,
    reconciling,
    updatingId,
    reconcileResult,
    setPage: handlePageChange,
    setStatusFilter: handleStatusFilterChange,
    setUserIdFilter: handleUserIdFilterChange,
    triggerReconcile: handleReconcile,
    updateStatus: handleUpdateStatus,
    fetchDetail,
    refresh: () => {
      lastFetchKeyRef.current = '';
      fetchPayments(page, statusFilter, userIdFilter);
    },
  };
}
