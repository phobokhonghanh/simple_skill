'use client';

import * as React from 'react';

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
          // Case 1: Opened in popup window. Send message back to parent and close.
          window.opener.postMessage(
            { type: 'GOOGLE_AUTH_SUCCESS', idToken },
            window.location.origin,
          );
          window.close();
        } else {
          // Case 2: Opened as direct redirect (popup blocked). Forward back to original page with token.
          // e.g. state is "/vi/cashback/" or "/en/cashback/"
          window.location.replace(`${window.location.origin}${state}${hash}`);
        }
      }
    } else {
      // Fallback: If no token, redirect back to the original page
      window.location.replace(`${window.location.origin}${state}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-[var(--aff-muted)]">
          Authenticating, please wait...
        </p>
      </div>
    </div>
  );
}
