import type {
  AffiliateResponse,
  LoginResponse,
  ConversionReportEnvelope,
  CashbackListResponse,
  ConversionRecord,
} from '@/features/cashback/types';
import {
  DEFAULT_API_URL,
  DEFAULT_AFFILIATE_ID,
  DEFAULT_SUB_ID,
} from '@/features/cashback/config';
import { dateToUnixSeconds } from '@/features/cashback/utils';

export { DEFAULT_AFFILIATE_ID, DEFAULT_SUB_ID };

export const API_ENDPOINTS = {
  shopeeAffiliate: '/api/shopee/affiliate',
  authLogin: '/api/auth/google/login',
  authLogout: '/api/auth/google/logout',
  userCashbacks: '/api/cashbacks',
  adminCashbacks: '/api/admin/cashbacks',
  userShopeeConversions: '/api/shopee/conversions',
  adminShopeeConversions: '/api/admin/shopee/conversions',
  shopeeSync: '/api/admin/shopee/conversions/sync',
} as const;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

interface ApiRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  params?: QueryParams;
  body?: unknown;
  errorCode?: string;
}

/**
 * Tự động tạo query string từ params object, bỏ qua các giá trị rỗng/null/undefined.
 */
function buildQueryString(params?: QueryParams): string {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

/**
 * Hàm gọi API dùng chung (Request Client) giúp loại bỏ trùng lặp headers, query params, error handling.
 */
async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
  const {
    endpoint,
    method = 'GET',
    token,
    params,
    body,
    errorCode = 'fetch_failed',
  } = options;

  try {
    const queryString = buildQueryString(params);
    const headers: Record<string, string> = {};

    if (body) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${DEFAULT_API_URL}${endpoint}${queryString}`,
      {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      },
    );

    if (!response.ok) {
      return { ok: false, code: errorCode } as T;
    }

    return (await response.json()) as T;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    return { ok: false, code: 'network_error' } as T;
  }
}

/**
 * Tạo link tiếp thị liên kết (affiliate link).
 */
export const generateCashbackLink = async ({
  link,
  affiliateId = DEFAULT_AFFILIATE_ID,
  subIds = [DEFAULT_SUB_ID],
  deepAndDeferred = 1,
}: {
  link: string;
  affiliateId?: string;
  subIds?: string[];
  deepAndDeferred?: number;
}): Promise<AffiliateResponse> =>
  apiRequest<AffiliateResponse>({
    endpoint: API_ENDPOINTS.shopeeAffiliate,
    method: 'POST',
    body: {
      link: link.trim(),
      affiliate_id: affiliateId,
      sub_ids: subIds,
      deep_and_deferred: deepAndDeferred,
    },
    errorCode: 'api_error',
  });

/**
 * Đăng nhập với Google OAuth ID Token.
 */
export const loginWithGoogle = async (
  idToken: string,
): Promise<LoginResponse> =>
  apiRequest<LoginResponse>({
    endpoint: API_ENDPOINTS.authLogin,
    method: 'POST',
    body: { id_token: idToken },
    errorCode: 'login_failed',
  });

/**
 * Đăng xuất khỏi hệ thống.
 */
export const logoutWithGoogle = async (
  token: string,
): Promise<{ ok: boolean }> =>
  apiRequest<{ ok: boolean }>({
    endpoint: API_ENDPOINTS.authLogout,
    method: 'POST',
    token,
  });

/**
 * Lấy lịch sử hoàn tiền cá nhân của người dùng.
 */
export const getUserCashbacks = async (
  token: string,
  params?: {
    page?: number;
    pageSize?: number;
    purchase_time_s?: number;
    purchase_time_e?: number;
  },
): Promise<CashbackListResponse> =>
  apiRequest<CashbackListResponse>({
    endpoint: API_ENDPOINTS.userCashbacks,
    token,
    params,
  });

/**
 * Admin: Lấy danh sách toàn bộ bản ghi hoàn tiền.
 */
export const getAdminCashbacks = async (
  token: string,
  params: {
    page?: number;
    pageSize?: number;
    userId?: string;
  },
): Promise<CashbackListResponse> =>
  apiRequest<CashbackListResponse>({
    endpoint: API_ENDPOINTS.adminCashbacks,
    token,
    params,
  });

/**
 * User: Lấy báo cáo chuyển đổi Shopee cá nhân.
 */
export const getUserShopeeConversions = async (
  token: string,
  params: {
    page_size?: number;
    page_num?: number;
    purchase_time_s?: number;
    purchase_time_e?: number;
  },
): Promise<ConversionReportEnvelope> =>
  apiRequest<ConversionReportEnvelope>({
    endpoint: API_ENDPOINTS.userShopeeConversions,
    token,
    params,
  });

/**
 * Admin: Lấy danh sách chuyển đổi Shopee của toàn bộ hệ thống.
 */
export const getAdminShopeeConversions = async (
  token: string,
  params: {
    page_size?: number;
    page_num?: number;
    sub_id?: string;
    purchase_time_s?: number;
    purchase_time_e?: number;
  },
): Promise<ConversionReportEnvelope> =>
  apiRequest<ConversionReportEnvelope>({
    endpoint: API_ENDPOINTS.adminShopeeConversions,
    token,
    params,
  });

/**
 * Admin: Kích hoạt đồng bộ chuyển đổi Shopee thủ công.
 */
export const syncAdminOrders = async (
  token: string,
  params: {
    purchase_time_s?: number;
    purchase_time_e?: number;
    sub_id?: string;
  },
): Promise<{ ok: boolean; code: string }> =>
  apiRequest<{ ok: boolean; code: string }>({
    endpoint: API_ENDPOINTS.shopeeSync,
    method: 'POST',
    token,
    params,
    errorCode: 'sync_failed',
  });

/**
 * User: Đồng bộ và đọc báo cáo chuyển đổi Shopee cá nhân.
 * Theo spec docs/api_collection.json: GET /api/shopee/conversions
 */
export const syncUserOrders = async (
  token: string,
  payload: { startDate: string; endDate: string },
): Promise<{
  ok: boolean;
  code?: string;
  data?: ConversionRecord[];
}> => {
  const sTime = dateToUnixSeconds(payload.startDate);
  const eTime = dateToUnixSeconds(payload.endDate, true);
  const res = await getUserShopeeConversions(token, {
    page_size: 100,
    page_num: 1,
    purchase_time_s: sTime,
    purchase_time_e: eTime,
  });
  if (res && res.ok && Array.isArray(res.data)) {
    return { ok: true, data: res.data };
  }
  return { ok: false, code: res?.code || 'sync_failed' };
};
