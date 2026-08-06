import { z } from 'zod';

/**
 * Zod Schema kiểm tra tính hợp lệ của thông tin tài khoản ngân hàng (`UpdatePaymentInfoRequest`).
 * Tuân thủ quy tắc agent_ca.md (Validation tách biệt khỏi UI).
 */
export const bankProfileSchema = z.object({
  bank_code: z.string().min(1, 'err_select_bank'),
  account_number: z
    .string()
    .trim()
    .min(3, 'err_account_number')
    .regex(/^[A-Za-z0-9]+$/, 'err_account_number_format'),
  account_name: z
    .string()
    .trim()
    .min(2, 'err_account_name')
    .transform((val) => val.toUpperCase()),
});

export type BankProfileFormData = z.infer<typeof bankProfileSchema>;

/**
 * Zod Schema cho yêu cầu tạo link Shopee Affiliate (`AffiliateRequest`).
 */
export const affiliateLinkSchema = z.object({
  link: z
    .string()
    .trim()
    .min(1, 'err_link_empty')
    .url('err_link_invalid')
    .refine(
      (url) => url.includes('shopee.vn') || url.includes('shp.ee'),
      'err_link_not_shopee',
    ),
  affiliate_id: z.string().min(1, 'err_affiliate_id_required'),
  sub_ids: z.array(z.string()).optional(),
});

export type AffiliateLinkFormData = z.infer<typeof affiliateLinkSchema>;
