'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

/** Props cho ClientWrapper */
export interface ClientWrapperProps {
  /** Component con chỉ render ở phía Client */
  children: React.ReactNode;
  /** UI dự phòng tùy chọn trong quá trình hydrations */
  fallback?: React.ReactNode;
}

const ClientWrapperComponent = ({ children }: ClientWrapperProps) => {
  return <>{children}</>;
};

/**
 * Component Wrapper thực thi render hoàn toàn ở Client-side (vô hiệu hóa SSR).
 * Sử dụng next/dynamic với `ssr: false` nhằm tránh lỗi Hydration Mismatch cho các phần tử phụ thuộc vào browser API.
 *
 * @param props - ClientWrapperProps chứa children và fallback.
 * @returns JSX Element render động ở Client.
 */
export const ClientWrapper = dynamic(
  () => Promise.resolve(ClientWrapperComponent),
  {
    ssr: false,
  },
);
