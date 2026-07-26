'use client';

import * as React from 'react';

/**
 * Trang redirect không phụ thuộc locale cho Bookmarks.
 * Tự động chuyển hướng trình duyệt tới đường dẫn `/en/bookmarks`.
 *
 * @returns Null.
 */
export default function BookmarksRedirectPage() {
  React.useEffect(() => {
    window.location.replace('/en/bookmarks');
  }, []);

  return null;
}
