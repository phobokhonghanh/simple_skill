import type {
  ConversionOrder,
  ConversionRecord,
  CashbackRecord,
} from './types';
import { formatDate } from '@/lib/date';
import { SHOPEE_CDN_PREFIX } from '@/features/cashback/config';

export { formatCurrency, formatNumber } from '@/lib/format';
export {
  formatDate,
  formatDateString,
  dateToUnixSeconds,
  getCurrentDateStr,
  getThirtyDaysAgoStr,
  getStartOfCurrentMonthStr,
} from '@/lib/date';
export { scrollToElement } from '@/lib/dom';

/**
 * Wrapper an toàn cho `localStorage` xử lý các môi trường SSR (Server-Side Rendering) và lỗi vượt quá dung lượng bộ nhớ.
 */
export const safeLocalStorage = {
  /**
   * Đọc giá trị từ localStorage theo key an toàn.
   *
   * @param key - Tên key lưu trữ.
   * @returns Giá trị chuỗi hoặc null nếu không tồn tại hoặc lỗi.
   */
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[localStorage] Đọc thất bại cho key "${key}":`, e);
      return null;
    }
  },
  /**
   * Ghi giá trị vào localStorage an toàn.
   *
   * @param key - Tên key lưu trữ.
   * @param value - Giá trị dạng chuỗi.
   */
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[localStorage] Ghi thất bại cho key "${key}":`, e);
    }
  },
  /**
   * Xóa một key khỏi localStorage an toàn.
   *
   * @param key - Tên key cần xóa.
   */
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[localStorage] Xóa thất bại cho key "${key}":`, e);
    }
  },
};

/**
 * Định dạng URL ảnh sản phẩm dựa trên quy tắc CDN của từng nền tảng.
 * Tự động thêm tiền tố Shopee CDN đối với các đường dẫn tương đối (hash).
 *
 * @param image - URL ảnh hoặc chuỗi hash ảnh.
 * @param platform - Tên nền tảng (mặc định 'shopee').
 * @returns Đường dẫn URL ảnh đầy đủ.
 */
export const formatImageUrl = (
  image?: string | null,
  platform = 'shopee',
): string => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  const lowerPlatform = platform?.toLowerCase();
  if (lowerPlatform === 'shopee') {
    return `${SHOPEE_CDN_PREFIX}${image}`;
  }
  return image;
};

/** Interface cấu hình style giao diện theo nền tảng */
export interface PlatformStyle {
  color: string;
  border: string;
}

/** Registry chứa cấu hình style (màu chữ, màu viền) tập trung cho từng nền tảng */
export const PLATFORM_STYLES: Record<string, PlatformStyle> = {
  shopee: {
    color: 'text-[var(--aff-orange)]',
    border: 'border-orange-500/30 hover:border-orange-500/60',
  },
  lazada: {
    color: 'text-blue-500 dark:text-blue-400',
    border: 'border-blue-500/30 hover:border-blue-500/60',
  },
  tiktok: {
    color: 'text-zinc-950 dark:text-zinc-100 font-extrabold',
    border:
      'border-zinc-800/30 dark:border-zinc-200/30 hover:border-zinc-950 dark:hover:border-zinc-100',
  },
};

const DEFAULT_PLATFORM_STYLE: PlatformStyle = { color: '', border: '' };

/**
 * Trả về cấu hình style (màu sắc, viền) của nền tảng với truy xuất O(1).
 *
 * @param platform - Tên nền tảng ('shopee', 'lazada', 'tiktok').
 * @returns PlatformStyle tương ứng.
 */
export const getPlatformStyle = (platform?: string | null): PlatformStyle => {
  if (!platform) return DEFAULT_PLATFORM_STYLE;
  return PLATFORM_STYLES[platform.toLowerCase()] || DEFAULT_PLATFORM_STYLE;
};

/** Cấu trúc kết quả thống kê đơn chuyển đổi */
export interface ConversionStats {
  totalAmount: number;
  totalItems: number;
  hasFraud: boolean;
  displayStatus: string;
  displayCashback: number;
}

/**
 * Tính tổng giá trị thực tế của danh sách các đơn hàng chuyển đổi.
 *
 * @param orders - Mảng ConversionOrder các đơn hàng.
 * @returns Tổng giá trị tiền mặt của đơn hàng.
 */
export const calculateOrderTotalAmount = (
  orders?: ConversionOrder[],
): number => {
  if (!orders) return 0;
  return orders.reduce(
    (acc, order) =>
      acc +
      (order.items?.reduce((sum, item) => sum + (item.actual_amount || 0), 0) ||
        0),
    0,
  );
};

/**
 * Tính toán các chỉ số thống kê đơn hàng bao gồm xử lý cờ gian lận (Fraud detection logic).
 *
 * @param orders - Mảng đơn hàng chuyển đổi.
 * @param rawCashback - Số tiền hoàn thực tế.
 * @param rawStatus - Trạng thái thô ban đầu.
 * @returns Đối tượng ConversionStats chứa các chỉ số đã tính toán.
 */
export const calculateConversionStats = (
  orders?: ConversionOrder[],
  rawCashback = 0,
  rawStatus = 'pending',
): ConversionStats => {
  const totalItems =
    orders?.reduce((acc, o) => acc + (o.items?.length || 0), 0) || 0;
  const totalAmount = calculateOrderTotalAmount(orders);
  const hasFraud =
    orders?.some((o) => o.items?.some((it) => it.is_fraud === 1)) ?? false;
  const displayStatus = hasFraud ? 'rejected' : rawStatus;
  const displayCashback = hasFraud ? 0 : rawCashback;

  return {
    totalAmount,
    totalItems,
    hasFraud,
    displayStatus,
    displayCashback,
  };
};

/**
 * Chuẩn hóa bản ghi ConversionRecord từ API Shopee sang định dạng CashbackRecord chuẩn.
 *
 * @param rec - Bản ghi ConversionRecord đầu vào.
 * @param platform - Tên nền tảng (mặc định 'shopee').
 * @returns Đối tượng CashbackRecord chuẩn hóa.
 */
export const mapConversionToCashbackRecord = (
  rec: ConversionRecord,
  platform = 'shopee',
): CashbackRecord => {
  const checkoutId = rec.checkout_id || '';
  return {
    id: checkoutId,
    userId: rec.utm_content || '',
    platform,
    cashback: rec.affiliate_net_commission
      ? parseFloat(rec.affiliate_net_commission)
      : 0,
    status: rec.checkout_status || 'pending',
    checkoutId,
    conversion: rec,
    createdAt: '',
    updatedAt: '',
  };
};

/** Structure tổng hợp CashbackSummary cho UI */
export interface CashbackSummary extends ConversionStats {
  raw: CashbackRecord;
  id: string;
  checkoutId: string;
  purchaseTime?: number | null;
  purchaseDateStr: string;
  platform: string;
  orders?: ConversionOrder[];
  utmContent?: string | null;
}

/**
 * Trích xuất các thuộc tính chuẩn hóa từ CashbackRecord dùng chung cho ConversionsTable và CashbackCard.
 *
 * @param rec - Bản ghi CashbackRecord.
 * @returns Dữ liệu tổng hợp CashbackSummary đã qua tính toán.
 */
export const extractCashbackSummary = (
  rec: CashbackRecord,
): CashbackSummary => {
  const purchaseTime = rec.conversion?.purchase_time;
  const platform = rec.platform || 'shopee';
  const rawCashback = rec.cashback;
  const rawStatus = rec.status || 'pending';
  const orders = rec.conversion?.orders;
  const utmContent = rec.conversion?.utm_content;

  const stats = calculateConversionStats(orders, rawCashback, rawStatus);
  const purchaseDateStr = formatDate(purchaseTime);

  return {
    raw: rec,
    id: rec.id,
    checkoutId: rec.checkoutId,
    purchaseTime,
    purchaseDateStr,
    platform,
    orders,
    utmContent,
    ...stats,
  };
};
