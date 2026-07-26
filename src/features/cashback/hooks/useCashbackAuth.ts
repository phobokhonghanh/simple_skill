'use client';

import * as React from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Custom hook bọc useAuth hỗ trợ callback tự động khi người dùng vừa hoàn tất đăng nhập thành công.
 *
 * @param onLoginSuccess - Callback được gọi duy nhất 1 lần khi trạng thái user chuyển từ null sang có thông tin.
 * @returns Đối tượng AuthContextType từ AuthProvider.
 */
export function useCashbackAuth(onLoginSuccess?: () => void) {
  const auth = useAuth();
  const prevUserRef = React.useRef(auth.user);

  React.useEffect(() => {
    if (!prevUserRef.current && auth.user) {
      onLoginSuccess?.();
    }
    prevUserRef.current = auth.user;
  }, [auth.user, onLoginSuccess]);

  return auth;
}
