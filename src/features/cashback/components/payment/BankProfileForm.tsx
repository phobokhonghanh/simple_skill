'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Building2, CreditCard, User as UserIcon, Save, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BankSelect } from './BankSelect';
import { useToast } from '@/components/providers/ToastProvider';
import type { Bank, UserPaymentInfo } from '@/features/cashback/types';

import { bankProfileSchema } from '@/features/cashback/utils/validation';

interface BankProfileFormProps {
  banks: Bank[];
  initialInfo?: UserPaymentInfo | null;
  onSave: (bankCode: string, accountNumber: string, accountName: string) => Promise<boolean>;
  loading?: boolean;
  onFetchBanks?: () => void;
}

export function BankProfileForm({
  banks,
  initialInfo,
  onSave,
  loading = false,
  onFetchBanks,
}: BankProfileFormProps) {
  const t = useTranslations('cashback.payment');
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  React.useEffect(() => {
    if (banks.length === 0 && onFetchBanks) {
      onFetchBanks();
    }
  }, [banks.length, onFetchBanks]);

  const [prevInitialInfo, setPrevInitialInfo] = React.useState(initialInfo);
  const [bankCode, setBankCode] = React.useState(initialInfo?.bankCode || '');
  const [accountNumber, setAccountNumber] = React.useState(initialInfo?.accountNumber || '');
  const [accountName, setAccountName] = React.useState(initialInfo?.accountName || '');

  if (initialInfo !== prevInitialInfo) {
    setPrevInitialInfo(initialInfo);
    if (initialInfo) {
      setBankCode(initialInfo.bankCode || '');
      setAccountNumber(initialInfo.accountNumber || '');
      setAccountName(initialInfo.accountName || '');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = bankProfileSchema.safeParse({
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const errorMsgKey = firstIssue?.message || 'err_update_failed';
      showErrorToast(t(errorMsgKey as Parameters<typeof t>[0]));
      return;
    }

    const { bank_code, account_number, account_name } = result.data;
    const success = await onSave(bank_code, account_number, account_name);
    if (success) {
      showSuccessToast(t('bank_info_saved'));
    } else {
      showErrorToast(t('err_update_failed'));
    }
  };

  return (
    <Card className="aff-card p-4 sm:p-6 rounded-2xl">
      <div className="flex items-center gap-3 border-b border-[var(--aff-border)] pb-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[var(--aff-orange)] flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)]">
            {t('bank_profile_title')}
          </h3>
          <p className="text-xs text-[var(--aff-muted)]">
            {t('bank_profile_desc')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Selection */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-[var(--aff-muted)] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('select_bank')}</span>
            <span className="text-red-500">*</span>
          </label>
          <BankSelect
            banks={banks}
            value={bankCode}
            onChange={setBankCode}
            disabled={loading}
          />
        </div>

        {/* Account Number */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-[var(--aff-muted)] flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('account_number')}</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            placeholder={t('account_number_placeholder')}
            disabled={loading}
            className="aff-input w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide"
          />
        </div>

        {/* Account Name */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-[var(--aff-muted)] flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5" />
            <span>{t('account_name')}</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={accountName}
            onChange={(e) => setAccountName(e.target.value.toUpperCase())}
            placeholder={t('account_name_placeholder')}
            disabled={loading}
            className="aff-input w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm uppercase font-semibold tracking-wider"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="aff-btn-primary w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('saving')}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t('save_bank_info')}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
