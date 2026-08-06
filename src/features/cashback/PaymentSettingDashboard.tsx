'use client';

import * as React from 'react';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CashbackPageLayout } from '@/features/cashback/components/layout/CashbackPageLayout';
import { useCashbackAuth, useUserPayments } from '@/features/cashback/hooks';
import { BankProfileForm } from '@/features/cashback/components/payment/BankProfileForm';
import { ProtectedRoute } from '@/components/providers/AuthProvider';
import { ClientWrapper } from '@/components/ui/ClientWrapper';

import '@/features/cashback/cashback.css';

/**
 * Component chính cho Trang Thiết lập thanh toán (/cashback/payment-setting).
 */
export function PaymentSettingDashboard() {
  const tAuth = useTranslations('auth');
  const auth = useCashbackAuth();

  const {
    banks,
    paymentInfo,
    savingInfo,
    savePaymentInfo,
    fetchBanks,
  } = useUserPayments(auth.token, { autoFetchPayments: false });

  const handleLogout = React.useCallback(async () => {
    await auth.handleLogout();
  }, [auth]);

  return (
    <CashbackPageLayout
      user={auth.user}
      handleLogout={handleLogout}
      onLoginClick={auth.initiateGoogleLogin}
      maxWidthClass="max-w-3xl"
    >
      <ProtectedRoute>
        <ClientWrapper>
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-1">
              <Link
                href="/cashback"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[var(--aff-text)] bg-[var(--aff-surface)] border border-[var(--aff-border)] hover:border-orange-500/30 hover:text-[var(--aff-orange)] transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[var(--aff-orange)]" />
                <span>{tAuth('buttons.back_to_cashback')}</span>
              </Link>
            </div>

            <BankProfileForm
              banks={banks}
              initialInfo={paymentInfo}
              onSave={savePaymentInfo}
              loading={savingInfo}
              onFetchBanks={fetchBanks}
            />
          </div>
        </ClientWrapper>
      </ProtectedRoute>
    </CashbackPageLayout>
  );
}
