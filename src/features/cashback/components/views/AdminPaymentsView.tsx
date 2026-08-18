'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Wallet,
  Eye,
  Loader2,
  AlertCircle,
  QrCode,
  CheckCircle2,
  XCircle,
  RotateCw,
  Search,
  Lock,
  Copy,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../StatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { PaymentDetailModal } from '../payment/PaymentDetailModal';
import { useAdminPayments } from '@/features/cashback/hooks/useAdminPayments';
import { generateVietQRUrl } from '@/features/cashback/utils/vietqr';
import { formatCurrency, formatDateOnly } from '@/features/cashback/utils';
import { formatVND } from '@/lib/format';
import { useToast } from '@/components/providers/ToastProvider';
import { TOAST_ORANGE_PRESET, PAYMENT_STATUS_OPTIONS } from '@/features/cashback/config';
import type { PaymentRecord, PaymentDetailRecord } from '@/features/cashback/types';

function PaymentCodeCell({
  id,
  maxWidthClass = 'max-w-[120px] sm:max-w-[160px]',
}: {
  id: string;
  maxWidthClass?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-1.5 overflow-hidden shrink min-w-0 max-w-full">
      <span
        className={`text-[var(--aff-heading)] font-normal font-mono text-xs truncate ${maxWidthClass}`}
      >
        {id}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded text-[var(--aff-muted)] hover:text-[var(--aff-heading)] hover:bg-gray-200/50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer shrink-0"
        title="Sao chép mã thanh toán"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

function UserIdCell({
  id,
  maxWidthClass = 'max-w-[120px] sm:max-w-[160px]',
}: {
  id: string;
  maxWidthClass?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-1.5 overflow-hidden shrink min-w-0 max-w-full">
      <span
        className={`text-[var(--aff-heading)] font-normal font-mono text-xs truncate ${maxWidthClass}`}
      >
        {id}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded text-[var(--aff-muted)] hover:text-[var(--aff-heading)] hover:bg-gray-200/50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer shrink-0"
        title="Sao chép User ID"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

interface AdminPaymentsViewProps {
  token: string;
}

export function AdminPaymentsView({ token }: AdminPaymentsViewProps) {
  const t = useTranslations('cashback.payment');
  const { custom: showCustomToast, error: showErrorToast } = useToast();

  const {
    payments,
    page,
    totalPages,
    statusFilter,
    userIdFilter,
    loading,
    reconciling,
    updatingId,
    setPage,
    setStatusFilter,
    setUserIdFilter,
    triggerReconcile,
    updateStatus,
    fetchDetail,
  } = useAdminPayments(token);

  const [activeModalId, setActiveModalId] = React.useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = React.useState<PaymentDetailRecord | null>(null);
  const [loadingDetail, setLoadingDetail] = React.useState(false);

  const handleOpenDetail = (p: PaymentRecord) => {
    setActiveModalId(p.id);
    setSelectedDetail({
      id: p.id,
      userId: p.userId,
      amount: p.amount,
      status: p.status,
      userPaymentInfo: p.userPaymentInfo,
      createdAt: p.createdAt,
      paidAt: p.paidAt,
      cashbacks: [],
    });
    setLoadingDetail(true);

    void fetchDetail(p.id).then((detail) => {
      if (detail) {
        setSelectedDetail(detail);
      }
      setLoadingDetail(false);
    });
  };

  const handleCloseDetail = () => {
    setActiveModalId(null);
    setSelectedDetail(null);
    setLoadingDetail(false);
  };

  const handleReconcile = async () => {
    const summary = await triggerReconcile();
    if (summary) {
      showCustomToast(
        t('reconcile_result_toast', {
          count: summary.createdPaymentsCount,
          amount: formatVND(summary.totalAmount),
          processed: summary.totalCashbacksProcessed,
        }),
        TOAST_ORANGE_PRESET,
      );
    } else {
      showErrorToast(t('err_update_failed'));
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Completed' | 'Cancelled') => {
    const updated = await updateStatus(id, newStatus);
    if (updated) {
      if (selectedDetail && selectedDetail.id === id) {
        setSelectedDetail(updated as PaymentDetailRecord);
      }
    } else {
      showErrorToast(t('err_update_failed'));
    }
  };

  const statusFilterRef = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});

  React.useEffect(() => {
    const activeBtn = statusFilterRef.current[statusFilter];
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      const containerWidth = container.clientWidth;
      const elLeft = activeBtn.offsetLeft;
      const elWidth = activeBtn.offsetWidth;
      const targetScrollLeft = elLeft - containerWidth / 2 + elWidth / 2;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [statusFilter]);

  return (
    <div className="space-y-4 max-w-full">
      {/* Top Banner: Auto Reconcile Action */}
      <Card className="aff-card p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)]">
                {t('admin_payout_title')}
              </h3>
              <p className="text-xs text-[var(--aff-muted)]">
                {t('admin_payout_subtitle')}
              </p>
            </div>
          </div>

          <Button
            type="button"
            disabled={reconciling}
            onClick={handleReconcile}
            className="aff-btn-primary h-10 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shrink-0 self-end sm:self-auto"
          >
            {reconciling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('reconciling')}</span>
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4" />
                <span>{t('reconcile_now')}</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Combined Card Container for Filters & Payments List */}
      <div className="aff-card-container">
        {/* Header Title & Filter Buttons */}
        <div className="aff-card-header">
          {/* User ID Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--aff-muted)]" />
            <input
              type="text"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              placeholder={t('filter_user_placeholder')}
              className="aff-input w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-[var(--aff-surface)] text-[var(--aff-text)]"
            />
          </div>

          {/* Filter Controls Bar */}
          <div className="aff-filter-bar scrollbar-none shrink-0">
            {PAYMENT_STATUS_OPTIONS.map((st) => (
              <button
                key={st.value}
                type="button"
                ref={(el) => {
                  statusFilterRef.current[st.value] = el;
                }}
                onClick={() => setStatusFilter(st.value)}
                className={`aff-filter-pill ${
                  statusFilter === st.value ? 'active' : ''
                }`}
              >
                {st.value === 'Pending' ? t('status_pending_admin') : t(st.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table / Grid List */}
        {loading ? (
          <div className="py-10 sm:py-12 min-h-[140px] flex flex-col items-center justify-center text-[var(--aff-muted)] gap-3 font-normal">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--aff-orange)]" />
            <span className="text-xs sm:text-sm">{t('loading_payments')}</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-10 sm:py-12 min-h-[140px] flex flex-col items-center justify-center text-[var(--aff-muted)] gap-2 font-normal">
            <AlertCircle className="w-8 h-8 opacity-40 text-[var(--aff-muted)]" />
            <span className="text-sm font-medium">{t('empty_payments')}</span>
          </div>
        ) : (
          <div>
            {/* === MOBILE VIEW (< sm): Card Layout === */}
            <div className="block sm:hidden space-y-3">
              {payments.map((p) => {
                const hasBankInfo = Boolean(
                  p.userPaymentInfo?.bankCode && p.userPaymentInfo?.accountNumber,
                );
                return (
                  <div key={p.id} className="aff-item-row space-y-2 text-xs">
                    {/* Row 1: Left Eye Icon Button (Gray bg if missing bank info), Right Status Badge */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(p)}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center ${
                          hasBankInfo
                            ? 'border border-[var(--aff-border)] hover:bg-orange-500/10 text-[var(--aff-heading)] hover:text-[var(--aff-orange)]'
                            : 'bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 border border-gray-300 dark:border-neutral-700'
                        }`}
                        title={t('view_details')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <StatusBadge status={p.status} />
                    </div>

                    {/* Row 2: Mã thanh toán (Đồng bộ với modal) */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[var(--aff-muted)] font-normal shrink-0">Mã thanh toán:</span>
                      <PaymentCodeCell id={p.id} />
                    </div>

                    {/* Row 3: User ID */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[var(--aff-muted)] font-normal shrink-0">User ID:</span>
                      <UserIdCell id={p.userId} />
                    </div>

                    {/* Row 4: Thời gian tạo (date-only, font-normal) */}
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--aff-muted)] font-normal">Thời gian tạo:</span>
                      <span className="text-[var(--aff-heading)] font-normal">
                        {formatDateOnly(p.createdAt)}
                      </span>
                    </div>

                    {/* Row 5: Số tiền */}
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--aff-muted)] font-normal">Số tiền:</span>
                      <span className="text-[var(--aff-orange)] font-bold text-sm">
                        {formatCurrency(p.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* === DESKTOP VIEW (>= sm): 6-column Table Layout === */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-[var(--aff-border)] text-[var(--aff-muted)] font-semibold">
                    <th className="py-3 px-3 w-[16%]">User ID</th>
                    <th className="py-3 px-3 w-[16%]">Thời gian tạo</th>
                    <th className="py-3 px-3 w-[20%]">Mã thanh toán</th>
                    <th className="py-3 px-3 w-[18%]">Số tiền</th>
                    <th className="py-3 px-3 w-[18%]">Trạng thái</th>
                    <th className="py-3 px-3 text-center w-[12%]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--aff-border)]">
                  {payments.map((p) => {
                    const hasBankInfo = Boolean(
                      p.userPaymentInfo?.bankCode && p.userPaymentInfo?.accountNumber,
                    );
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                        {/* 1. User ID */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <UserIdCell id={p.userId} />
                        </td>

                        {/* 2. Thời gian tạo */}
                        <td className="py-3.5 px-3 text-[var(--aff-heading)] font-normal whitespace-nowrap">
                          {formatDateOnly(p.createdAt)}
                        </td>

                        {/* 3. Mã thanh toán (Đồng bộ với modal) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <PaymentCodeCell id={p.id} />
                        </td>

                        {/* 4. Số tiền */}
                        <td className="py-3.5 px-3 text-[var(--aff-orange)] font-bold whitespace-nowrap text-sm">
                          {formatCurrency(p.amount)}
                        </td>

                        {/* 5. Trạng thái */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <StatusBadge status={p.status} />
                        </td>

                        {/* 6. Thao tác (Chỉ hiển thị icon eyes, màu xám nếu chưa có thông tin ngân hàng) */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(p)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center justify-center ${
                              hasBankInfo
                                ? 'border border-[var(--aff-border)] hover:bg-orange-500/10 text-[var(--aff-heading)] hover:text-[var(--aff-orange)]'
                                : 'bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 border border-gray-300 dark:border-neutral-700'
                            }`}
                            title={hasBankInfo ? t('view_details') : 'Chưa có thông tin thanh toán'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination UI Component */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
          className="mt-4"
        />
      </div>

      {/* Admin Payment Detail & VietQR Modal */}
      {activeModalId && selectedDetail && (
        <PaymentDetailModal
          detail={selectedDetail}
          loading={loadingDetail}
          onClose={handleCloseDetail}
          adminSlot={
            selectedDetail.status === 'Pending' && selectedDetail.userPaymentInfo ? (
              <div className="p-4 rounded-md bg-orange-500/5 border border-orange-500/20 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-[var(--aff-orange)] font-extrabold text-xs">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{t('vietqr_title')}</span>
                </div>

                {generateVietQRUrl(selectedDetail) ? (
                  <div className="relative w-52 h-52 sm:w-60 sm:h-60 mx-auto rounded-md overflow-hidden border-2 border-orange-500/30 bg-white p-2 shadow-md">
                    <Image
                      src={generateVietQRUrl(selectedDetail)!}
                      alt="VietQR Payment Code"
                      width={240}
                      height={240}
                      className="object-contain w-full h-full"
                      unoptimized
                    />
                  </div>
                ) : null}

                <div className="text-xs text-[var(--aff-muted)]">
                  {t('vietqr_subtitle')}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    type="button"
                    disabled={updatingId === selectedDetail.id}
                    onClick={() => handleUpdateStatus(selectedDetail.id, 'Completed')}
                    className="w-full sm:w-auto h-10 px-5 rounded-md font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {updatingId === selectedDetail.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{t('confirm_completed')}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    disabled={updatingId === selectedDetail.id}
                    onClick={() => handleUpdateStatus(selectedDetail.id, 'Cancelled')}
                    className="w-full sm:w-auto h-10 px-4 rounded-md font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t('cancel_payment')}</span>
                  </Button>
                </div>
              </div>
            ) : selectedDetail.status !== 'Pending' ? (
              <div className="p-3.5 rounded-md bg-slate-500/10 border border-slate-500/20 text-xs flex items-start gap-2.5 text-[var(--aff-muted)]">
                <Lock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--aff-heading)] block mb-0.5">
                    {selectedDetail.status === 'Completed'
                      ? t('already_completed')
                      : t('already_cancelled')}
                  </span>
                  <span>{t('bank_snapshot_notice')}</span>
                </div>
              </div>
            ) : null
          }
        />
      )}
    </div>
  );
}

