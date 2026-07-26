'use client';

import * as React from 'react';

/**
 * Root Page ở cấp ngoài cùng.
 * Tự động chuyển hướng (redirect) người dùng về trang mặc định `/en`.
 *
 * @returns Null.
 */
export default function RootPage() {
  React.useEffect(() => {
    window.location.replace('/en');
  }, []);

  return null;
}
