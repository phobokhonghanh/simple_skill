'use client';

import type { ConversionRecord } from './conversion';
import type { Pagination } from './common';

export interface CashbackRecord {
  id: string;
  userId: string;
  platform: string;
  cashback: number;
  status: string;
  checkoutId: string;
  paymentId?: string | null;
  conversion: ConversionRecord;
  createdAt: string;
  updatedAt: string;
}

export interface CashbackListResponse {
  ok: boolean;
  code: string;
  data?: CashbackRecord[] | null;
  pagination?: Pagination | null;
}
