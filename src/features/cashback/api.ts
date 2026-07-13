import type {
  CashbackResponse,
  LoginResponse,
  ConversionReportEnvelope,
  CashbackListResponse,
} from '@/features/cashback/types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  'http://localhost:8787';

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

export const generateCashbackLink = async ({
  link,
  affiliateId = '17314780502',
  subIds = ['ndinhnguyen'],
  deepAndDeferred = 1,
}: {
  link: string;
  affiliateId?: string;
  subIds?: string[];
  deepAndDeferred?: number;
}): Promise<CashbackResponse> => {
  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.shopeeAffiliate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        link: link.trim(),
        affiliate_id: affiliateId,
        sub_ids: subIds,
        deep_and_deferred: deepAndDeferred,
      }),
    });

    if (!response.ok) {
      return { ok: false, code: 'api_error' };
    }

    return (await response.json()) as CashbackResponse;
  } catch (err) {
    console.error('generateCashbackLink error:', err);
    return { ok: false, code: 'network_error' };
  }
};

// Login with Google OAuth ID Token
export const loginWithGoogle = async (
  idToken: string,
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.authLogin}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    if (!response.ok) {
      return { ok: false, code: 'login_failed' };
    }

    return (await response.json()) as LoginResponse;
  } catch (err) {
    console.error('loginWithGoogle error:', err);
    return { ok: false, code: 'network_error' };
  }
};

// Logout
export const logoutWithGoogle = async (
  token: string,
): Promise<{ ok: boolean }> => {
  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.authLogout}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { ok: response.ok };
  } catch (err) {
    console.error('logoutWithGoogle error:', err);
    return { ok: false };
  }
};

// Get current user's cashback history
export const getUserCashbacks = async (
  token: string,
  params?: {
    page?: number;
    pageSize?: number;
    purchase_time_s?: number;
    purchase_time_e?: number;
  },
): Promise<CashbackListResponse> => {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.pageSize) query.set('pageSize', params.pageSize.toString());
    if (params?.purchase_time_s)
      query.set('purchase_time_s', params.purchase_time_s.toString());
    if (params?.purchase_time_e)
      query.set('purchase_time_e', params.purchase_time_e.toString());

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.userCashbacks}${suffix}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return { ok: false, code: 'fetch_failed' };
    }

    return (await response.json()) as CashbackListResponse;
  } catch (err) {
    console.error('getUserCashbacks error:', err);
    return { ok: false, code: 'network_error' };
  }
};

// Admin: Get all cashback records
export const getAdminCashbacks = async (
  token: string,
  params: {
    page?: number;
    pageSize?: number;
    userId?: string;
  },
): Promise<CashbackListResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.pageSize) query.set('pageSize', params.pageSize.toString());
    if (params.userId) query.set('userId', params.userId);

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.adminCashbacks}${suffix}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return { ok: false, code: 'fetch_failed' };
    }

    return (await response.json()) as CashbackListResponse;
  } catch (err) {
    console.error('getAdminCashbacks error:', err);
    return { ok: false, code: 'network_error' };
  }
};

// User: Get and sync user-specific Shopee conversions
export const getUserShopeeConversions = async (
  token: string,
  params: {
    page_size?: number;
    page_num?: number;
    purchase_time_s: number;
    purchase_time_e: number;
  },
): Promise<ConversionReportEnvelope> => {
  try {
    const query = new URLSearchParams();
    if (params.page_size) query.set('page_size', params.page_size.toString());
    if (params.page_num) query.set('page_num', params.page_num.toString());
    query.set('purchase_time_s', params.purchase_time_s.toString());
    query.set('purchase_time_e', params.purchase_time_e.toString());

    const suffix = `?${query.toString()}`;
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.userShopeeConversions}${suffix}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return { ok: false, code: 'fetch_failed' };
    }

    return (await response.json()) as ConversionReportEnvelope;
  } catch (err) {
    console.error('getUserShopeeConversions error:', err);
    return { ok: false, code: 'network_error' };
  }
};

// Admin: Get all user Shopee conversions
export const getAdminShopeeConversions = async (
  token: string,
  params: {
    page_size?: number;
    page_num?: number;
    sub_id?: string;
    purchase_time_s?: number;
    purchase_time_e?: number;
  },
): Promise<ConversionReportEnvelope> => {
  try {
    const query = new URLSearchParams();
    if (params.page_size) query.set('page_size', params.page_size.toString());
    if (params.page_num) query.set('page_num', params.page_num.toString());
    if (params.sub_id) query.set('sub_id', params.sub_id);
    if (params.purchase_time_s)
      query.set('purchase_time_s', params.purchase_time_s.toString());
    if (params.purchase_time_e)
      query.set('purchase_time_e', params.purchase_time_e.toString());

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.adminShopeeConversions}${suffix}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return { ok: false, code: 'fetch_failed' };
    }

    return (await response.json()) as ConversionReportEnvelope;
  } catch (err) {
    console.error('getAdminShopeeConversions error:', err);
    return { ok: false, code: 'network_error' };
  }
};

// Admin: Trigger manual sync of Shopee conversions
export const syncShopeeCashbacks = async (
  token: string,
  params: {
    purchase_time_s?: number;
    purchase_time_e?: number;
    sub_id?: string;
  },
): Promise<{ ok: boolean; code: string }> => {
  try {
    const query = new URLSearchParams();
    if (params.purchase_time_s)
      query.set('purchase_time_s', params.purchase_time_s.toString());
    if (params.purchase_time_e)
      query.set('purchase_time_e', params.purchase_time_e.toString());
    if (params.sub_id) query.set('sub_id', params.sub_id);

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.shopeeSync}${suffix}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return { ok: false, code: 'sync_failed' };
    }

    return { ok: true, code: 'success' };
  } catch (err) {
    console.error('syncShopeeCashbacks error:', err);
    return { ok: false, code: 'network_error' };
  }
};
