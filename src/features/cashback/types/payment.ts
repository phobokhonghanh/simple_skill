'use client';

import type { UserPaymentInfo } from './bank';
import type { CashbackRecord } from './cashback';
import type { Pagination } from './common';

export type PaymentStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  cashbackCount?: number;
  status: PaymentStatus;
  userPaymentInfo?: UserPaymentInfo | null;
  createdAt: string;
  paidAt?: string | null;
  updatedAt?: string;
}

export interface PaymentDetailRecord extends PaymentRecord {
  cashbacks?: CashbackRecord[];
}

export interface PaymentListEnvelope {
  ok: boolean;
  code: string;
  data?: PaymentRecord[];
  pagination?: Pagination;
}

export interface PaymentDetailEnvelope {
  ok: boolean;
  code: string;
  data?: PaymentDetailRecord;
}

export interface ReconciliationSummary {
  createdPaymentsCount: number;
  totalAmount: number;
  totalCashbacksProcessed: number;
}

export interface ReconcileEnvelope {
  ok: boolean;
  code: string;
  data?: ReconciliationSummary;
}
