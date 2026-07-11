export interface Product {
  itemId?: string | number | null;
  productName: string;
  shopName?: string | null;
  price: number;
  sales?: number | null;
  imageUrl?: string | null;
  rating?: number | Record<string, unknown> | null;
  commission?: number | null;
  lastUpdate?: string | null;
}

export interface HistoryItem {
  url: string;
  product: Product;
  affiliateLink: string;
  timestamp: number;
}

export interface CashbackResponse {
  ok: boolean;
  code: string;
  data?: {
    affiliate_link: string;
    product: Product | null;
  } | null;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
  role: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export interface LoginResponse {
  ok: boolean;
  code: string;
  data?: LoginResponseData | null;
}

export interface ConversionItem {
  display_item_status?: string | null;
  affiliate_item_status?: number | null;
  shop_id?: number | null;
  shop_name?: string | null;
  item_id?: number | null;
  item_name?: string | null;
  item_price?: number | null;
  item_commission?: number | null;
  img_code?: string | null;
  actual_amount?: number | null;
  qty?: number | null;
  is_fraud?: number | null;
  fraud_reason?: string | null;
  fraud_status?: number | null;
  platform_commission_rate?: number | null;
}

export interface ConversionOrder {
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
  data?: ConversionReportData | null;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CashbackRecord {
  id?: string;
  userId: string;
  platform: string;
  cashback: number;
  status: string;
  checkoutId: string;
  conversion?: ConversionRecord | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CashbackListResponse {
  ok: boolean;
  code: string;
  data?: CashbackRecord[] | null;
  pagination?: Pagination | null;
}
