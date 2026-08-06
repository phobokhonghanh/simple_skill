'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Copy, Check, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '../StatusBadge';
import {
  formatCurrency,
  formatDateOnly,
  formatDayMonth,
  maskAccountNumber,
} from '@/features/cashback/utils';
import type { PaymentDetailRecord } from '@/features/cashback/types';

interface PaymentDetailModalProps {
  detail: PaymentDetailRecord;
  loading?: boolean;
  onClose: () => void;
  /** Slot để chèn VietQR và các nút duyệt/hủy đối với view Admin */
  adminSlot?: React.ReactNode;
}

export function PaymentDetailModal({
  detail,
  loading = false,
  onClose,
  adminSlot,
}: PaymentDetailModalProps) {
  const t = useTranslations('cashback.payment');
  const [showAllCashbacks, setShowAllCashbacks] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const bankInfo = detail.userPaymentInfo;
  const cashbacks = detail.cashbacks || [];
  const visibleCashbacks = showAllCashbacks ? cashbacks : cashbacks.slice(0, 5);

  const handleCopyId = () => {
    if (detail.id) {
      void navigator.clipboard.writeText(detail.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const titleNode = (
    <span className="font-bold text-sm text-[var(--aff-heading)]">
      Thông tin đối soát
    </span>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={titleNode}
      maxWidthClass="max-w-2xl"
      hideHeaderBorder={true}
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-[var(--aff-muted)] gap-3 font-normal">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--aff-orange)]" />
          <span className="text-xs">Đang tải thông tin đối soát...</span>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Admin Custom Slot (VietQR & Action Buttons) */}
          {adminSlot}

          {/* 6 Fields Metadata Section */}
          <div className="space-y-2.5 p-3.5 rounded-md bg-gray-50/80 dark:bg-neutral-800/60 border border-gray-200/80 dark:border-neutral-800">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-[var(--aff-muted)] font-normal shrink-0 whitespace-nowrap">
                Mã thanh toán:
              </span>
              <div className="flex items-center gap-1 overflow-hidden shrink min-w-0">
                <span className="text-[var(--aff-heading)] font-normal font-mono text-xs truncate max-w-[220px] sm:max-w-[360px]">
                  {detail.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 rounded text-[var(--aff-muted)] hover:text-[var(--aff-heading)] hover:bg-gray-200/50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer shrink-0"
                  title="Sao chép mã"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-[var(--aff-muted)] font-normal shrink-0 whitespace-nowrap">
                Thời gian tạo:
              </span>
              <span className="text-[var(--aff-heading)] font-normal text-right">
                {formatDateOnly(detail.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-[var(--aff-muted)] font-normal shrink-0 whitespace-nowrap">
                Thời gian thanh toán:
              </span>
              <span className="text-[var(--aff-heading)] font-normal text-right">
                {detail.paidAt ? formatDateOnly(detail.paidAt) : '- - -'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-[var(--aff-muted)] font-normal shrink-0 whitespace-nowrap">
                Ngân hàng:
              </span>
              <span className="text-[var(--aff-heading)] font-normal text-right truncate min-w-0">
                {bankInfo?.bankName || bankInfo?.bankCode || ''}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-[var(--aff-muted)] font-normal shrink-0 whitespace-nowrap">
                Số tài khoản:
              </span>
              <span className="text-[var(--aff-heading)] font-normal font-mono text-right">
                {maskAccountNumber(bankInfo?.accountNumber)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-[var(--aff-muted)] font-normal shrink-0 whitespace-nowrap">
                Tên người nhận:
              </span>
              <span className="text-[var(--aff-heading)] font-normal uppercase text-right truncate min-w-0">
                {bankInfo?.accountName || ''}
              </span>
            </div>
          </div>

          {/* Horizontal Divider Line */}
          <hr className="border-t border-gray-200/80 dark:border-neutral-800 my-4" />

          {/* Sub-header Row: Đối soát vào ngày DD/MM + Status Badge */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[var(--aff-heading)]">
              Đối soát vào ngày {formatDayMonth(detail.createdAt)}
            </span>
            <StatusBadge status={detail.status} />
          </div>

          {/* Single Container Div (Tương tự phần thông tin ngân hàng, không border riêng từng item) */}
          <div className="p-3.5 rounded-md bg-gray-50/80 dark:bg-neutral-800/60 border border-gray-200/80 dark:border-neutral-800 space-y-3">
            {/* Row 1: Tổng hoàn tiền hợp lệ */}
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-200/60 dark:border-neutral-700/60">
              <span className="font-bold text-[var(--aff-heading)]">
                Tổng hoàn tiền hợp lệ:
              </span>
              <span className="font-bold text-base text-[var(--aff-orange)]">
                {formatCurrency(detail.amount)}
              </span>
            </div>

            {/* Cashback Items List (Flex rows không có border từng item & số tiền không màu) */}
            {cashbacks.length > 0 ? (
              <div className="space-y-2.5">
                {visibleCashbacks.map((cb) => (
                  <div
                    key={cb.id}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-[var(--aff-heading)] font-normal">
                      Hoàn tiền ngày {formatDateOnly(cb.createdAt)}:
                    </span>
                    <span className="font-bold text-[var(--aff-heading)] whitespace-nowrap">
                      {formatCurrency(cb.cashback)}
                    </span>
                  </div>
                ))}

                {/* Show More Expand Arrow Button if > 5 items */}
                {cashbacks.length > 5 && (
                  <div className="pt-1.5 text-center border-t border-gray-200/40 dark:border-neutral-700/40">
                    <button
                      type="button"
                      onClick={() => setShowAllCashbacks(!showAllCashbacks)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors cursor-pointer select-none"
                    >
                      <span>
                        {showAllCashbacks
                          ? 'Thu gọn'
                          : `Xem thêm (${cashbacks.length - 5} đơn)`}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showAllCashbacks ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-[var(--aff-muted)] py-2 text-center">
                {t('empty_payments')}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}


