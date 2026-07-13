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
  };
}
