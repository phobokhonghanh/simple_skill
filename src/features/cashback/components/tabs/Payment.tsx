'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { CircleDollarSign } from 'lucide-react';
import { ClientWrapper } from '@/components/ui/ClientWrapper';
import Coin from '@/features/cashback/components/Coin';
import { StatCard } from '@/features/cashback/components/StatCard';
import { useCashbackAuth, useUserPayments, useUserDashboard } from '@/features/cashback/hooks';
import { BankWarningBanner } from '../payment/BankWarningBanner';
import { UserPaymentList } from '../payment/UserPaymentList';
import { formatCurrency } from '@/features/cashback/utils';

export function PaymentTab() {
  const tPay = useTranslations('cashback.payment');
  const { token } = useCashbackAuth();
  // Always fetch user's own dashboard stats for Payment tab regardless of role
  const { stats: dashStats } = useUserDashboard(token, false);

  const {
    payments,
    page,
    totalPages,
    totalRecords,
    statusFilter,
    accumulatedBalance,
    shouldShowWarning,
    loadingPayments,
    setPage,
    setStatusFilter,
    fetchDetail,
  } = useUserPayments(token, dashStats?.totalCashback);

  const handleOpenPaymentSetting = () => {
    if (typeof window !== 'undefined') {
      window.open('/cashback/payment-setting', '_blank');
    }
  };

  const completedAmount = dashStats?.totalPaymentsCompleted ?? 0;
  const pendingAmount = dashStats?.totalPaymentsPending ?? accumulatedBalance;

  return (
    <ClientWrapper>
      <div className="space-y-5 max-w-full">
        {/* Warning Banner when Threshold Reached & Missing Bank Info */}
        {shouldShowWarning && (
          <BankWarningBanner
            onActionClick={handleOpenPaymentSetting}
            className="animate-in fade-in-50 slide-in-from-top-4"
          />
        )}

        {/* Payout Schedule Notice Box */}
        <div className="aff-notice-box text-xs sm:text-sm text-left">
          <p>
            {tPay.rich('payout_schedule_notice', {
              orange: (chunks) => (
                <span className="text-[var(--aff-orange)] font-bold">
                  {chunks}
                </span>
              ),
            })}
          </p>
        </div>

        {/* 2 Compact Stat Cards: Đã thanh toán & Chờ thanh toán (2 cột trên mobile) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <StatCard
            title={tPay('completed_payments')}
            value={
              <span className="text-[var(--aff-money)] font-bold text-xs sm:text-base">
                {formatCurrency(completedAmount)}
              </span>
            }
            icon={<Coin size={24} className="coin-2d" animate={false} />}
            className="rounded-md p-3 sm:p-4 gap-1.5 sm:gap-2"
          />
          <StatCard
            title={tPay('pending_payments')}
            value={
              <span className="text-[var(--aff-heading)] font-bold text-xs sm:text-base">
                {formatCurrency(pendingAmount)}
              </span>
            }
            icon={<CircleDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-neutral-300" />}
            iconBgClass="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300"
            className="rounded-md p-3 sm:p-4 gap-1.5 sm:gap-2"
          />
        </div>

        {/* Payment History List */}
        <UserPaymentList
          payments={payments}
          loading={loadingPayments}
          page={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          statusFilter={statusFilter}
          onPageChange={setPage}
          onStatusFilterChange={setStatusFilter}
          onFetchDetail={fetchDetail}
        />
      </div>
    </ClientWrapper>
  );
}
