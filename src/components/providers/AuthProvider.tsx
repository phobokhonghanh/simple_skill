'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { loginWithGoogle, logoutWithGoogle } from '@/features/cashback/api';
import type { User } from '@/features/cashback/types';
import { useToast } from '@/components/providers/ToastProvider';

/** Key lưu trữ Auth Token trong localStorage */
export const AUTH_TOKEN_KEY = 'ndinhnguyen_token';
/** Key lưu trữ thông tin User trong localStorage */
export const AUTH_USER_KEY = 'ndinhnguyen_user';

/**
 * Interface cho Auth Context quản lý trạng thái đăng nhập và các thao tác xác thực.
 */
export interface AuthContextType {
  /** Thông tin người dùng hiện tại (hoặc null nếu chưa đăng nhập) */
  user: User | null;
  /** JWT token xác thực (hoặc null) */
  token: string | null;
  /** Trạng thái đang xử lý xác thực */
  loading: boolean;
  /** Đã xác thực hay chưa */
  isAuthenticated: boolean;
  /** Là tài khoản quản trị viên (Admin) hay không */
  isAdmin: boolean;
  /** Lỗi API xác thực hiện tại */
  apiError: string | null;
  /** Cập nhật thông báo lỗi API */
  setApiError: (err: string | null) => void;
  /** Xử lý đăng nhập với Google ID Token */
  handleGoogleLogin: (idToken: string) => Promise<void>;
  /** Xử lý đăng xuất */
  handleLogout: () => Promise<void>;
  /** Mở popup đăng nhập OAuth Google */
  initiateGoogleLogin: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

/** Trạng thái xác thực nội bộ của Provider */
interface AuthState {
  token: string | null;
  user: User | null;
}

/**
 * Provider xác thực người dùng toàn hệ thống (Global Auth Provider).
 * Quản lý việc lưu trữ token, thông tin người dùng trong localStorage và đồng bộ luồng đăng nhập Google.
 *
 * @param props - Props chứa children node.
 * @returns JSX Element bọc AuthContext.Provider xung quanh ứng dụng.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [authState, setAuthState] = React.useState<AuthState>(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser) as User;
          return { token: storedToken, user };
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }
    }
    return { token: null, user: null };
  });

  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const processingTokenRef = React.useRef<string | null>(null);

  const handleGoogleLogin = React.useCallback(
    async (idToken: string) => {
      if (processingTokenRef.current === idToken) return;
      processingTokenRef.current = idToken;
      setLoading(true);
      setApiError(null);
      try {
        const res = await loginWithGoogle(idToken);
        if (res.ok && res.data) {
          localStorage.setItem(AUTH_TOKEN_KEY, res.data.token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data.user));
          setAuthState({ token: res.data.token, user: res.data.user });

          const randIndex = Math.floor(Math.random() * 3);
          const greetMsg = tAuth(`toasts.welcome.${randIndex}`, {
            name: res.data.user.name || 'User',
          });
          showSuccessToast(greetMsg);
        } else {
          setApiError(tCommon('errors.not_found'));
          showErrorToast(tAuth('toasts.login_failed'));
        }
      } catch (err) {
        console.error(err);
        setApiError(tCommon('errors.not_found'));
        showErrorToast(tAuth('toasts.login_failed'));
      } finally {
        setLoading(false);
        processingTokenRef.current = null;
      }
    },
    [tCommon, tAuth, showSuccessToast, showErrorToast],
  );

  const initiateGoogleLogin = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (!googleClientId) {
      console.warn('Google Client ID chưa được cấu hình.');
      return;
    }

    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const redirectUri = `${window.location.origin}/auth/callback/`;
    const state = window.location.pathname;
    const nonce =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    const oauthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=${encodeURIComponent('id_token')}` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&state=${encodeURIComponent(state)}` +
      `&nonce=${encodeURIComponent(nonce)}`;

    try {
      window.open(
        oauthUrl,
        'GoogleSignInPopup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`,
      );
    } catch (e) {
      console.error('Không thể mở popup Google Sign-In, chuyển hướng trực tiếp:', e);
      window.location.href = oauthUrl;
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.idToken) {
        void handleGoogleLogin(event.data.idToken);
      }
    };
    window.addEventListener('message', handleMessage);

    const checkHash = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('id_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const idToken = params.get('id_token');
        if (idToken) {
          if (window.opener) {
            window.opener.postMessage(
              { type: 'GOOGLE_AUTH_SUCCESS', idToken },
              window.location.origin,
            );
            window.close();
          } else {
            void handleGoogleLogin(idToken);
            window.history.replaceState(
              null,
              '',
              window.location.pathname + window.location.search,
            );
          }
        }
      }
    };

    checkHash();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleGoogleLogin]);

  const isClearingSessionRef = React.useRef(false);

  const clearUnauthorizedSession = React.useCallback(() => {
    if (isClearingSessionRef.current) return;
    isClearingSessionRef.current = true;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuthState({ token: null, user: null });
    processingTokenRef.current = null;
    showErrorToast(tAuth('protected.require_login'));
    setTimeout(() => {
      isClearingSessionRef.current = false;
    }, 1000);
  }, [showErrorToast, tAuth]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnauthorized = () => {
      clearUnauthorizedSession();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearUnauthorizedSession]);

  const handleLogout = React.useCallback(async () => {
    const currentToken = authState.token;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuthState({ token: null, user: null });
    processingTokenRef.current = null;

    if (currentToken) {
      try {
        await logoutWithGoogle(currentToken);
      } catch (err) {
        console.error('API đăng xuất thất bại:', err);
      }
    }

    const randIndex = Math.floor(Math.random() * 3);
    const farewellMsg = tAuth(`toasts.goodbye.${randIndex}`);
    showSuccessToast(farewellMsg);
  }, [authState.token, tAuth, showSuccessToast]);

  const value = React.useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      loading,
      isAuthenticated: Boolean(authState.token && authState.user),
      isAdmin: authState.user?.role === 'admin',
      apiError,
      setApiError,
      handleGoogleLogin,
      handleLogout,
      initiateGoogleLogin,
    }),
    [
      authState.user,
      authState.token,
      loading,
      apiError,
      handleGoogleLogin,
      handleLogout,
      initiateGoogleLogin,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook để truy xuất Auth Context ở bất kỳ đâu trong toàn bộ ứng dụng.
 *
 * @throws {Error} Ném ra lỗi nếu hook được gọi ngoài phạm vi AuthProvider.
 * @returns Đối tượng AuthContextType chứa trạng thái và hàm quản lý xác thực.
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}

/**
 * Props cho Guard Component ProtectedRoute.
 */
export interface ProtectedRouteProps {
  /** Nội dung component con hiển thị khi thỏa mãn điều kiện bảo vệ */
  children: React.ReactNode;
  /** Yêu cầu quyền quản trị viên (Admin) */
  requireAdmin?: boolean;
  /** Giao diện dự phòng hiển thị khi người dùng chưa đăng nhập */
  fallback?: React.ReactNode;
}

/**
 * Guard Component dùng để bảo vệ các trang/tính năng yêu cầu Đăng nhập hoặc Quyền Admin.
 * Tự động hiển thị giao diện yêu cầu đăng nhập nếu người dùng chưa xác thực.
 *
 * @param props - ProtectedRouteProps bao gồm children, requireAdmin và fallback.
 * @returns JSX Element của children hoặc UI cảnh báo truy cập.
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback,
}: ProtectedRouteProps) {
  const tAuth = useTranslations('auth');
  const { isAuthenticated, isAdmin, initiateGoogleLogin } = useAuth();
  const emptySubscribe = React.useCallback(() => () => {}, []);
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="py-12 px-4 text-center space-y-4">
        <p className="text-sm text-[var(--aff-muted)]">
          {tAuth('protected.require_login')}
        </p>
        <button
          onClick={initiateGoogleLogin}
          className="bg-[var(--aff-orange)] hover:bg-[var(--aff-orange-hover)] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
        >
          {tAuth('buttons.login_google')}
        </button>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="py-12 px-4 text-center text-xs text-red-500">
        {tAuth('protected.unauthorized_admin')}
      </div>
    );
  }

  return <>{children}</>;
}
