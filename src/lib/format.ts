/**
 * Các tùy chọn cấu hình định dạng tiền tệ.
 */
export interface FormatCurrencyOptions {
  /** Ký hiệu tiền tệ (mặc định: '₫') */
  currency?: string;
  /** Mã ngôn ngữ định dạng số (mặc định: 'vi-VN') */
  locale?: string;
  /** Chuỗi hiển thị dự phòng khi giá trị không hợp lệ (mặc định: '—') */
  fallback?: string;
  /** Tiền tố hiển thị trước giá trị (mặc định: '') */
  prefix?: string;
  /** Tự động thêm dấu '+' phía trước số dương (mặc định: false) */
  showPlus?: boolean;
}

/**
 * Định dạng một số tiền thành chuỗi tiền tệ theo chuẩn địa phương.
 *
 * @param amount - Số tiền cần định dạng (có thể null hoặc undefined).
 * @param options - Cấu hình ký hiệu tiền tệ, locale, tiền tố và chuỗi dự phòng.
 * @returns Chuỗi tiền tệ đã định dạng (ví dụ: "100.000 ₫", "+5.000 ₫" hoặc "—").
 */
export const formatCurrency = (
  amount?: number | null,
  options: FormatCurrencyOptions = {},
): string => {
  const {
    currency = '₫',
    locale = 'vi-VN',
    fallback = '—',
    prefix = '',
    showPlus = false,
  } = options;
  if (amount === undefined || amount === null || isNaN(amount)) return fallback;
  const sign = showPlus && amount > 0 ? '+' : prefix;
  return `${sign}${amount.toLocaleString(locale)} ${currency}`.trim();
};

/**
 * Định dạng số tiền VNĐ.
 */
export const formatVND = (amount?: number | null): string => {
  return formatCurrency(amount, { currency: 'VNĐ' });
};

/**
 * Các tùy chọn cấu hình định dạng số chung.
 */
export interface FormatNumberOptions {
  /** Chuỗi dự phòng khi giá trị rỗng/không hợp lệ (mặc định: 'N/A') */
  fallback?: string;
  /** Số lượng chữ số thập phân hiển thị (mặc định: 1) */
  digits?: number;
  /** Tự động bỏ các số 0 thừa phía sau thập phân nếu là số nguyên (mặc định: true) */
  trimTrailingZeros?: boolean;
}

/**
 * Định dạng một giá trị số với số chữ số thập phân tùy chỉnh.
 *
 * @param value - Giá trị số cần định dạng.
 * @param options - Cấu hình chuỗi dự phòng, số chữ số thập phân và lược bỏ số 0 thừa.
 * @returns Chuỗi số đã định dạng (ví dụ: "4.5" hoặc "N/A").
 */
export const formatNumber = (
  value?: number | null,
  options: FormatNumberOptions = {},
): string => {
  const { fallback = 'N/A', digits = 1, trimTrailingZeros = true } = options;
  if (value === undefined || value === null || isNaN(value)) return fallback;
  if (trimTrailingZeros && value % 1 === 0) return value.toString();
  return value.toFixed(digits);
};

export { formatDate } from './date';
