'use client';

import type { PaymentRecord } from '@/features/cashback/types';

/**
 * Trích xuất URL ảnh QR VietQR CDN cho đợt thanh toán từ `payment.userPaymentInfo`.
 * Trả về `null` nếu người dùng chưa cấu hình thông tin ngân hàng.
 */
export function generateVietQRUrl(payment: PaymentRecord): string | null {
  const info = payment.userPaymentInfo;
  if (!info || !info.bankCode || !info.accountNumber) {
    return null;
  }

  const bankId = info.bankCode.trim();
  const accountNo = info.accountNumber.trim();
  const amount = Math.round(payment.amount);
  const memo = encodeURIComponent(`Payment ${payment.id}`);
  const accountName = encodeURIComponent(info.accountName || '');

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;
}
