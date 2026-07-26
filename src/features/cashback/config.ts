/**
 * Các hằng số cấu hình cho Phân hệ Cashback (Hoàn tiền mua sắm).
 */

/** API Server URL mặc định */
export const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  'http://localhost:8787';

/** Affiliate ID mặc định */
export const DEFAULT_AFFILIATE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_AFFILIATE_ID ?? '17314780502';

/** Sub ID mặc định định danh ứng dụng */
export const DEFAULT_SUB_ID =
  process.env.NEXT_PUBLIC_DEFAULT_SUB_ID ?? 'ndinhnguyen';

/** Số lượng dòng trên một trang dữ liệu mặc định */
export const DEFAULT_PAGE_SIZE = 20;

/** Tiền tố CDN tải ảnh sản phẩm Shopee */
export const SHOPEE_CDN_PREFIX = 'https://cf.shopee.vn/file/';

/** Cấu hình màu sắc hiển thị Toast thông báo thương hiệu Cashback (Màu cam) */
export const TOAST_ORANGE_PRESET = {
  bgClass: 'bg-orange-500/5 dark:bg-orange-500/10 backdrop-blur-md',
  textClass: 'text-orange-600 dark:text-orange-400 font-semibold',
  borderClass: 'border-orange-500/20 dark:border-orange-500/30',
  progressClass: 'bg-orange-500',
} as const;

/** Danh sách tên miền hỗ trợ tạo link hoàn tiền */
export const SUPPORTED_DOMAINS = [
  'shopee.vn',
  'shp.ee',
  'shopee.co.id',
  'shopee.sg',
  'shopee.tw',
] as const;

/** Các trạng thái của đơn hàng hoàn tiền */
export const CASHBACK_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  WAITING_FOR_PAYMENT: 'waiting for payment',
} as const;

/** Type mô tả trạng thái đơn hoàn tiền */
export type CashbackStatus =
  (typeof CASHBACK_STATUSES)[keyof typeof CASHBACK_STATUSES];

/** Danh sách giá trị trạng thái hoàn tiền hợp lệ */
export const KNOWN_STATUS_VALUES = Object.values(CASHBACK_STATUSES) as string[];

/**
 * Trả về mảng sub_id được chuẩn hóa gửi kèm request API affiliate.
 *
 * @param userId - ID của người dùng (nếu có).
 * @returns Mảng chuỗi sub_id.
 */
export const getFormattedSubId = (userId?: string | null): string[] => {
  if (!userId) return [DEFAULT_SUB_ID];
  return [`${DEFAULT_SUB_ID}-${userId}`];
};

/** Danh sách tùy chọn nền tảng sàn thương mại điện tử */
export const PLATFORM_OPTIONS = [
  { value: 'all', labelKey: 'filters.all_platforms' },
  { value: 'shopee', labelKey: 'platforms.shopee' },
  { value: 'lazada', labelKey: 'platforms.lazada' },
  { value: 'tiktok', labelKey: 'platforms.tiktok' },
] as const;

/** Danh sách tùy chọn trạng thái phục vụ lọc đơn hàng */
export const STATUS_OPTIONS = [
  { value: 'all', labelKey: 'filters.all_statuses' },
  { value: CASHBACK_STATUSES.PENDING, labelKey: 'status.pending' },
  { value: CASHBACK_STATUSES.APPROVED, labelKey: 'status.approved' },
  { value: CASHBACK_STATUSES.COMPLETED, labelKey: 'status.completed' },
  { value: CASHBACK_STATUSES.REJECTED, labelKey: 'status.rejected' },
  { value: CASHBACK_STATUSES.CANCELLED, labelKey: 'status.cancelled' },
] as const;
