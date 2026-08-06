'use client';

import * as React from 'react';

/** Props cho ClientWrapper */
export interface ClientWrapperProps {
  /** Component con chỉ render ở phía Client */
  children: React.ReactNode;
  /** UI dự phòng tùy chọn trong quá trình hydration */
  fallback?: React.ReactNode;
}

/**
 * Component Wrapper thực thi render an toàn ở Client-side, loại bỏ lỗi Hydration Mismatch trong Next.js.
 *
 * @param props - ClientWrapperProps chứa children và fallback.
 * @returns JSX Element render ở Client sau khi đã mounted.
 */
const emptySubscribe = () => () => {};

export function ClientWrapper({ children, fallback = null }: ClientWrapperProps) {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
