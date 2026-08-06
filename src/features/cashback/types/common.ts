'use client';

import type { CashbackStatus as ConfigCashbackStatus } from '../config';

export type CashbackStatus = ConfigCashbackStatus;

export type PlatformType = 'shopee' | 'lazada' | 'tiktok';

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  ok: boolean;
  code: string;
  data?: T | null;
  pagination?: Pagination | null;
}
