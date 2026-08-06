import type {
  AffiliateResponse,
  LoginResponse,
  ConversionReportEnvelope,
  CashbackListResponse,
  ConversionRecord,
  Bank,
  UserPaymentInfo,
  UpdatePaymentInfoRequest,
  PaymentListEnvelope,
  PaymentDetailEnvelope,
  ReconcileEnvelope,
  PaymentStatus,
  DashboardEnvelope,
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
  banks: '/api/banks',
  userPaymentInfo: '/api/user/payment-info',
  userDashboard: '/api/user/dashboard',
  adminDashboard: '/api/admin/dashboard',
  userPayments: '/api/payments',
  adminReconcile: '/api/admin/payments/reconcile',
  adminPayments: '/api/admin/payments',
} as const;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

interface ApiRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
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

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      return { ok: false, code: 'auth_required' } as T;
    }

    if (!response.ok) {
      return { ok: false, code: errorCode } as T;
    }

    const data = (await response.json()) as T;
    if (
      data &&
      typeof data === 'object' &&
      'ok' in data &&
      data.ok === false &&
      'code' in data &&
      (data.code === 'auth_required' || data.code === 'unauthorized')
    ) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    return data;
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

/**
 * Public: Lấy danh sách Ngân hàng Việt Nam hỗ trợ chuyển khoản.
 */
export const getBanks = async (): Promise<{
  ok: boolean;
  code: string;
  data?: Bank[];
}> =>
  apiRequest<{ ok: boolean; code: string; data?: Bank[] }>({
    endpoint: API_ENDPOINTS.banks,
    method: 'GET',
  });

/**
 * User: Lấy thông tin tài khoản ngân hàng cá nhân hiện tại.
 */
export const getUserPaymentInfo = async (
  token: string,
): Promise<{ ok: boolean; code: string; data?: UserPaymentInfo }> =>
  apiRequest<{ ok: boolean; code: string; data?: UserPaymentInfo }>({
    endpoint: API_ENDPOINTS.userPaymentInfo,
    method: 'GET',
    token,
  });

/**
 * User: Cập nhật thông tin tài khoản ngân hàng cá nhân.
 * Note: Body chỉ chứa 3 trường bank_code, account_number, account_name.
 */
export const updateUserPaymentInfo = async (
  token: string,
  payload: UpdatePaymentInfoRequest,
): Promise<{ ok: boolean; code: string; data?: UserPaymentInfo }> =>
  apiRequest<{ ok: boolean; code: string; data?: UserPaymentInfo }>({
    endpoint: API_ENDPOINTS.userPaymentInfo,
    method: 'PUT',
    token,
    body: payload,
    errorCode: 'update_payment_info_failed',
  });

/**
 * User: Lấy danh sách đợt thanh toán cá nhân.
 */
export const getUserPayments = async (
  token: string,
  params?: { page?: number; pageSize?: number; status?: string },
): Promise<PaymentListEnvelope> =>
  apiRequest<PaymentListEnvelope>({
    endpoint: API_ENDPOINTS.userPayments,
    method: 'GET',
    token,
    params,
  });

/**
 * User: Lấy chi tiết 1 đợt thanh toán cá nhân.
 */
export const getUserPaymentDetail = async (
  token: string,
  id: string,
): Promise<PaymentDetailEnvelope> =>
  apiRequest<PaymentDetailEnvelope>({
    endpoint: `${API_ENDPOINTS.userPayments}/${id}`,
    method: 'GET',
    token,
  });

/**
 * Admin: Kích hoạt đợt đối soát tự động tạo đợt thanh toán cho user đủ >= 50k VNĐ.
 */
export const reconcilePayments = async (
  token: string,
): Promise<ReconcileEnvelope> =>
  apiRequest<ReconcileEnvelope>({
    endpoint: API_ENDPOINTS.adminReconcile,
    method: 'POST',
    token,
    errorCode: 'reconcile_failed',
  });

/**
 * Admin: Lấy danh sách tất cả đợt thanh toán hệ thống.
 */
export const getAdminPayments = async (
  token: string,
  params?: {
    page?: number;
    pageSize?: number;
    userId?: string;
    status?: string;
  },
): Promise<PaymentListEnvelope> =>
  apiRequest<PaymentListEnvelope>({
    endpoint: API_ENDPOINTS.adminPayments,
    method: 'GET',
    token,
    params,
  });

/**
 * Admin: Lấy chi tiết đợt thanh toán hệ thống.
 */
export const getAdminPaymentDetail = async (
  token: string,
  id: string,
): Promise<PaymentDetailEnvelope> =>
  apiRequest<PaymentDetailEnvelope>({
    endpoint: `${API_ENDPOINTS.adminPayments}/${id}`,
    method: 'GET',
    token,
  });

/**
 * Admin: Cập nhật trạng thái đợt thanh toán ('Completed' | 'Cancelled').
 */
export const updateAdminPaymentStatus = async (
  token: string,
  id: string,
  status: PaymentStatus,
): Promise<PaymentDetailEnvelope> =>
  apiRequest<PaymentDetailEnvelope>({
    endpoint: `${API_ENDPOINTS.adminPayments}/${id}/status`,
    method: 'PATCH',
    token,
    body: { status },
    errorCode: 'update_status_failed',
  });

/**
 * User: Lấy thông tin thống kê dashboard cá nhân (countOrders, totalCashback, totalPaymentsPending, totalPaymentsCompleted).
 */
export const getUserDashboard = async (
  token: string,
): Promise<DashboardEnvelope> =>
  apiRequest<DashboardEnvelope>({
    endpoint: API_ENDPOINTS.userDashboard,
    method: 'GET',
    token,
  });

/**
 * Admin: Lấy thông tin thống kê dashboard hệ thống.
 */
export const getAdminDashboard = async (
  token: string,
): Promise<DashboardEnvelope> =>
  apiRequest<DashboardEnvelope>({
    endpoint: API_ENDPOINTS.adminDashboard,
    method: 'GET',
    token,
  });


