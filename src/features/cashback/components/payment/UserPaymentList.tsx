'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Building2,
  Calendar,
  Layers,
  Eye,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../StatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { PaymentDetailModal } from './PaymentDetailModal';
import { PAYMENT_STATUS_OPTIONS } from '@/features/cashback/config';
import { formatCurrency, formatDate, formatDateOnly } from '@/features/cashback/utils';
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

interface UserPaymentListProps {
  payments: PaymentRecord[];
  loading?: boolean;
  page: number;
  totalPages: number;
  totalRecords?: number;
  statusFilter: string;
  onPageChange: (newPage: number) => void;
  onStatusFilterChange: (newStatus: string) => void;
  onFetchDetail: (id: string) => Promise<PaymentDetailRecord | null>;
}

export function UserPaymentList({
  payments,
  loading = false,
  page,
  totalPages,
  totalRecords,
  statusFilter,
  onPageChange,
  onStatusFilterChange,
  onFetchDetail,
}: UserPaymentListProps) {
  const t = useTranslations('cashback.payment');

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

    void onFetchDetail(p.id).then((data) => {
      if (data) {
        setSelectedDetail(data);
      }
      setLoadingDetail(false);
    });
  };

  const handleCloseDetail = () => {
    setActiveModalId(null);
    setSelectedDetail(null);
    setLoadingDetail(false);
  };

  const statusFilterRef = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});

  React.useEffect(() => {
    const activeBtn = statusFilterRef.current[statusFilter];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [statusFilter]);

  return (
    <div className="space-y-4 max-w-full">
      {/* Combined Card: Header Title Left + Filter Buttons Right + Payment Batch List */}
      <div className="aff-card-container">
        {/* Top Header Row inside Card */}
        <div className="aff-card-header">
          <h3 className="aff-card-title">
            {t('payment_history_title')}
          </h3>

          {/* Filter Controls Bar */}
          <div className="aff-filter-bar scrollbar-none shrink-0">
            {PAYMENT_STATUS_OPTIONS.map((st) => (
              <button
                key={st.value}
                type="button"
                ref={(el) => {
                  statusFilterRef.current[st.value] = el;
                }}
                onClick={() => onStatusFilterChange(st.value)}
                className={`aff-filter-pill ${
                  statusFilter === st.value ? 'active' : ''
                }`}
              >
                {t(st.labelKey)}
              </button>
            ))}
          </div>
        </div>

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
            {/* === MOBILE VIEW (< sm): 4-row Card Layout === */}
            <div className="block sm:hidden space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="aff-item-row space-y-2 text-xs">
                  {/* Row 1: Left Eye Icon Button, Right Status Badge */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(p)}
                      className="p-1.5 rounded-md border border-[var(--aff-border)] hover:bg-orange-500/10 text-[var(--aff-heading)] hover:text-[var(--aff-orange)] transition-colors cursor-pointer"
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

                  {/* Row 3: Thời gian tạo (date-only, font-normal) */}
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--aff-muted)] font-normal">Thời gian tạo:</span>
                    <span className="text-[var(--aff-heading)] font-normal">
                      {formatDateOnly(p.createdAt)}
                    </span>
                  </div>

                  {/* Row 4: Số tiền */}
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--aff-muted)] font-normal">Số tiền:</span>
                    <span className="text-[var(--aff-orange)] font-bold text-sm">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* === DESKTOP VIEW (>= sm): 5-column Table Layout === */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-[var(--aff-border)] text-[var(--aff-muted)] font-semibold">
                    <th className="py-3 px-3 w-1/5">Thời gian tạo</th>
                    <th className="py-3 px-3 w-1/5">Mã thanh toán</th>
                    <th className="py-3 px-3 w-1/5">Số tiền</th>
                    <th className="py-3 px-3 w-1/5">Trạng thái</th>
                    <th className="py-3 px-3 text-center w-1/5">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--aff-border)]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                      {/* 1. Thời gian tạo */}
                      <td className="py-3.5 px-3 text-[var(--aff-heading)] font-normal whitespace-nowrap">
                        {formatDateOnly(p.createdAt)}
                      </td>

                      {/* 2. Mã thanh toán (Đồng bộ với modal) */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <PaymentCodeCell id={p.id} />
                      </td>

                      {/* 3. Số tiền */}
                      <td className="py-3.5 px-3 text-[var(--aff-orange)] font-bold whitespace-nowrap text-sm">
                        {formatCurrency(p.amount)}
                      </td>

                      {/* 4. Trạng thái */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <StatusBadge status={p.status} />
                      </td>

                      {/* 5. Thao tác */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(p)}
                          className="p-1.5 rounded-md border border-[var(--aff-border)] hover:bg-orange-500/10 text-[var(--aff-heading)] hover:text-[var(--aff-orange)] transition-colors cursor-pointer inline-flex items-center justify-center"
                          title={t('view_details')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination UI Component */}
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          loading={loading}
          className="mt-4"
        />
      </div>

      {/* Payment Detail Modal */}
      {activeModalId && selectedDetail && (
        <PaymentDetailModal
          detail={selectedDetail}
          loading={loadingDetail}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
