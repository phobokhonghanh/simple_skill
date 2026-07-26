'use client';

import * as React from 'react';

/**
 * Trang redirect không phụ thuộc locale cho Experience.
 * Tự động chuyển hướng trình duyệt tới đường dẫn `/en/experience`.
 *
 * @returns Null.
 */
export default function ExperienceRedirectPage() {
  React.useEffect(() => {
    window.location.replace('/en/experience');
  }, []);

  return null;
}
