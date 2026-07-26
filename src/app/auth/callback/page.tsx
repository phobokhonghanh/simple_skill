'use client';

import * as React from 'react';

/**
 * Trang nhận Callback xác thực từ Google OAuth2 Redirect (AuthCallbackPage).
 * Trích xuất `id_token` từ URL Hash:
 * - Nếu mở dưới dạng Popup: Gửi message `GOOGLE_AUTH_SUCCESS` về cửa sổ gốc (opener) và tự động đóng popup.
 * - Nếu bị chặn popup: Chuyển hướng trực tiếp trở lại URL trang ban đầu (state) đính kèm token.
 *
 * @returns JSX Element giao diện màn hình chờ Authenticating...
 */
export default function AuthCallbackPage() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state') || '/en/cashback/';

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
          window.location.replace(`${window.location.origin}${state}${hash}`);
        }
      }
    } else {
      window.location.replace(`${window.location.origin}${state}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-[var(--aff-muted)]">
          Đang xác thực, vui lòng chờ...
        </p>
      </div>
    </div>
  );
}
