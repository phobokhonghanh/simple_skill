'use client';

import { Pagination } from './common';
import type { Product } from './product';

export interface ConversionItem {
  product?: Product | null;
  qty?: number | null;
  actual_amount?: number | null;
  is_fraud?: number | null;

  // Backward compatibility fields
  display_item_status?: string | null;
  affiliate_item_status?: number | null;
  shop_id?: number | null;
  shop_name?: string | null;
  item_id?: number | null;
  item_name?: string | null;
  item_price?: number | null;
  item_commission?: number | null;
  img_code?: string | null;
  fraud_reason?: string | null;
  fraud_status?: number | null;
  platform_commission_rate?: number | null;
}

export interface ConversionOrder {
  id?: string | null;
  order_sn?: string | null;
  order_id?: string | null;
  order_status?: string | null;
  display_order_status?: number | null;
  complete_time?: number | null;
  fraud_complete_time?: number | null;
  items?: ConversionItem[];
}

export interface ConversionRecord {
  purchase_time?: number | null;
  checkout_id?: string | null;
  checkout_status?: string | null;
  checkout_status_app?: number | null;
  checkout_complete_time?: number | null;
  affiliate_id?: number | null;
  affiliate_name?: string | null;
  affiliate_net_commission?: string | null;
  utm_content?: string | null;
  device?: string | null;
  orders?: ConversionOrder[];
}

export interface ConversionReportData {
  page_num: number;
  page_size: number;
  total_count: number;
  list: ConversionRecord[];
}

export interface ConversionReportEnvelope {
  ok: boolean;
  code: string;
  data?: ConversionRecord[] | null;
  pagination?: Pagination | null;
}
