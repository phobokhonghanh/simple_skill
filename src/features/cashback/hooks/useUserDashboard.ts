'use client';

import * as React from 'react';
import type { DashboardStats } from '@/features/cashback/types';
import { getUserDashboard, getAdminDashboard } from '@/features/cashback/api';

export function useUserDashboard(token: string | null, isAdmin: boolean = false) {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(false);
  const lastTokenRef = React.useRef<string>('');

  const fetchDashboard = React.useCallback(
    async (userToken: string, userIsAdmin: boolean) => {
      if (!userToken) return;
      setLoading(true);
      try {
        const apiFn = userIsAdmin ? getAdminDashboard : getUserDashboard;
        const res = await apiFn(userToken);
        if (res.ok && res.data) {
          setStats(res.data);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    if (token) {
      const tokenKey = `${token}_${isAdmin}`;
      if (lastTokenRef.current !== tokenKey) {
        lastTokenRef.current = tokenKey;
        fetchDashboard(token, isAdmin);
      }
    } else if (lastTokenRef.current) {
      lastTokenRef.current = '';
    }
  }, [token, isAdmin, fetchDashboard]);

  const refreshDashboard = React.useCallback(() => {
    if (token) {
      lastTokenRef.current = '';
      fetchDashboard(token, isAdmin);
    }
  }, [token, isAdmin, fetchDashboard]);

  return {
    stats: token ? stats : null,
    loading: token ? loading : false,
    refreshDashboard,
  };
}
