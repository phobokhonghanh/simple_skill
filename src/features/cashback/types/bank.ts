'use client';

/**
 * Ngân hàng hỗ trợ chuyển khoản tại Việt Nam từ API `GET /api/banks`
 */
export interface Bank {
  code: string;
  name: string;
  shortName?: string;
  bin?: string;
  logo?: string;
}

/**
 * Thông tin ngân hàng nhận thanh toán của người dùng.
 */
export interface UserPaymentInfo {
  userId?: string;
  email?: string;
  name?: string;
  bankCode?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
}

/**
 * Request body để cập nhật tài khoản ngân hàng người dùng (`PUT /api/user/payment-info`).
 * Lưu ý: Không gửi bank_name (backend tự động tra cứu từ bank_code).
 */
export interface UpdatePaymentInfoRequest {
  bank_code: string;
  account_number: string;
  account_name: string;
}
