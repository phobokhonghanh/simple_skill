'use client';

import * as React from 'react';
import type { Bank, UserPaymentInfo, PaymentRecord, PaymentDetailRecord } from '@/features/cashback/types';
import {
  getBanks,
  getUserPaymentInfo,
  updateUserPaymentInfo,
  getUserPayments,
  getUserPaymentDetail,
} from '@/features/cashback/api';

export interface UseUserPaymentsOptions {
  autoFetchPayments?: boolean;
  accumulatedBalance?: number;
}

export function useUserPayments(
  token: string | null,
  options?: UseUserPaymentsOptions | number,
) {
  const autoFetchPayments =
    typeof options === 'object' ? options?.autoFetchPayments ?? true : true;
  const customAccumulatedBalance =
    typeof options === 'number' ? options : options?.accumulatedBalance;

  const [banks, setBanks] = React.useState<Bank[]>([]);
  const [paymentInfo, setPaymentInfo] = React.useState<UserPaymentInfo | null>(null);
  const [payments, setPayments] = React.useState<PaymentRecord[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState('');

  const [loadingBanks, setLoadingBanks] = React.useState(false);
  const [loadingInfo, setLoadingInfo] = React.useState(false);
  const [loadingPayments, setLoadingPayments] = React.useState(false);
  const [savingInfo, setSavingInfo] = React.useState(false);

  // Ref chống trùng lặp request
  const lastInfoTokenRef = React.useRef<string>('');
  const lastPaymentsKeyRef = React.useRef<string>('');

  // 1. Lấy danh sách ngân hàng Việt Nam (Chỉ gọi khi component mở form yêu cầu call fetchBanks)
  const fetchBanks = React.useCallback(async () => {
    setLoadingBanks(true);
    try {
      const res = await getBanks();
      if (res.ok && res.data) {
        setBanks(res.data);
      }
    } finally {
      setLoadingBanks(false);
    }
  }, []);

  // 2. Lấy thông tin tài khoản ngân hàng người dùng
  const fetchPaymentInfo = React.useCallback(async (userToken: string) => {
    if (lastInfoTokenRef.current === userToken) return;
    lastInfoTokenRef.current = userToken;

    setLoadingInfo(true);
    try {
      const res = await getUserPaymentInfo(userToken);
      if (res.ok && res.data) {
        setPaymentInfo(res.data);
      }
    } finally {
      setLoadingInfo(false);
    }
  }, []);

  // 3. Lấy danh sách đợt thanh toán (Chỉ gọi khi autoFetchPayments: true)
  const fetchPaymentsOnly = React.useCallback(
    async (userToken: string, targetPage: number, targetStatus: string) => {
      const fetchKey = `${userToken}_${targetPage}_${targetStatus}`;
      if (lastPaymentsKeyRef.current === fetchKey) return;
      lastPaymentsKeyRef.current = fetchKey;

      setLoadingPayments(true);
      try {
        const paymentsRes = await getUserPayments(userToken, {
          page: targetPage,
          pageSize: 10,
          status: targetStatus || undefined,
        });

        if (paymentsRes.ok && paymentsRes.data) {
          setPayments(paymentsRes.data);
          if (paymentsRes.pagination) {
            setTotalPages(paymentsRes.pagination.totalPages || 1);
            setTotalRecords(paymentsRes.pagination.total || 0);
          }
        }
      } finally {
        setLoadingPayments(false);
      }
    },
    [],
  );

  // Load Payment Info khi Token sẵn sàng
  React.useEffect(() => {
    if (token) {
      fetchPaymentInfo(token);
    } else if (lastInfoTokenRef.current) {
      lastInfoTokenRef.current = '';
    }
  }, [token, fetchPaymentInfo]);

  // Load danh sách Đợt thanh toán (Chỉ tải nếu autoFetchPayments là true)
  React.useEffect(() => {
    if (token && autoFetchPayments) {
      fetchPaymentsOnly(token, page, statusFilter);
    }
  }, [token, page, statusFilter, autoFetchPayments, fetchPaymentsOnly]);

  // Lưu/cập nhật thông tin ngân hàng
  const savePaymentInfo = async (
    bankCode: string,
    accountNumber: string,
    accountName: string,
  ): Promise<boolean> => {
    if (!token) return false;
    setSavingInfo(true);
    const res = await updateUserPaymentInfo(token, {
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName,
    });
    setSavingInfo(false);
    if (res.ok && res.data) {
      setPaymentInfo(res.data);
      return true;
    }
    return false;
  };

  // Chi tiết 1 đợt thanh toán
  const fetchDetail = async (id: string): Promise<PaymentDetailRecord | null> => {
    if (!token) return null;
    const res = await getUserPaymentDetail(token, id);
    if (res.ok && res.data) {
      return res.data;
    }
    return null;
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const accumulatedBalance = customAccumulatedBalance ?? 0;
  const isMissingBankInfo =
    !paymentInfo?.bankCode || !paymentInfo?.accountNumber || !paymentInfo?.accountName;
  const hasPendingPayment = payments.some((p) => p.status === 'Pending');
  const isThresholdReached = accumulatedBalance >= 50000 || hasPendingPayment;
  const shouldShowWarning = isThresholdReached && isMissingBankInfo;

  return {
    banks,
    paymentInfo: token ? paymentInfo : null,
    payments: token ? payments : [],
    page,
    totalPages,
    totalRecords,
    statusFilter,
    accumulatedBalance,
    isThresholdReached,
    isMissingBankInfo,
    shouldShowWarning,
    loadingBanks,
    loadingInfo,
    loadingPayments,
    savingInfo,
    setPage: handlePageChange,
    setStatusFilter: handleStatusFilterChange,
    savePaymentInfo,
    fetchBanks,
    fetchPayments: () => {
      if (token) {
        lastPaymentsKeyRef.current = '';
        fetchPaymentsOnly(token, page, statusFilter);
      }
    },
    fetchDetail,
    refreshAll: () => {
      if (token) {
        lastInfoTokenRef.current = '';
        lastPaymentsKeyRef.current = '';
        fetchPaymentInfo(token);
        if (autoFetchPayments) {
          fetchPaymentsOnly(token, page, statusFilter);
        }
      }
    },
  };
}
