import type { Product } from './product';

export interface AffiliateResponse {
  ok: boolean;
  code: string;
  data?: {
    affiliate_link: string;
    product: Product | null;
  } | null;
}

export interface HistoryItem {
  url: string;
  product: Product;
  affiliateLink: string;
  timestamp: number;
}
