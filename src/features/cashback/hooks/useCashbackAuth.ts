'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { loginWithGoogle, logoutWithGoogle } from '@/features/cashback/api';
import type { User } from '@/features/cashback/types';

export function useCashbackAuth(onLoginSuccess?: () => void) {
  const t = useTranslations('cashback');

  const [token, setToken] = React.useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cashback_token');
    }
    return null;
  });

  const [user, setUser] = React.useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('cashback_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser) as User;
        } catch {
          localStorage.removeItem('cashback_token');
          localStorage.removeItem('cashback_user');
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const handleGoogleLogin = React.useCallback(
    async (idToken: string) => {
      setLoading(true);
      setApiError(null);
      try {
        const res = await loginWithGoogle(idToken);
        if (res.ok && res.data) {
          setToken(res.data.token);
          setUser(res.data.user);
          localStorage.setItem('cashback_token', res.data.token);
          localStorage.setItem('cashback_user', JSON.stringify(res.data.user));
          onLoginSuccess?.();
        } else {
          setApiError(t('not_found'));
        }
      } catch (err) {
        console.error(err);
        setApiError(t('not_found'));
      } finally {
        setLoading(false);
      }
    },
    [t, onLoginSuccess],
  );

  const initiateGoogleLogin = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (!googleClientId) {
      console.warn('Google Client ID is not configured.');
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
      console.error('Failed to open popup, redirecting instead:', e);
      window.location.href = oauthUrl;
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.idToken) {
        handleGoogleLogin(event.data.idToken);
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
            handleGoogleLogin(idToken);
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

  const handleLogout = React.useCallback(async () => {
    if (token) {
      try {
        await logoutWithGoogle(token);
      } catch (err) {
        console.error('Logout API failed', err);
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('cashback_token');
    localStorage.removeItem('cashback_user');
  }, [token]);

  return {
    user,
    token,
    loading,
    apiError,
    setApiError,
    setUser,
    setToken,
    handleGoogleLogin,
    handleLogout,
    initiateGoogleLogin,
  };
}
