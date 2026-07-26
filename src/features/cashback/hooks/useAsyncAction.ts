'use client';

import * as React from 'react';

/** Options cho hook useAsyncAction */
interface UseAsyncActionOptions<T> {
  /** Thông báo lỗi tùy chỉnh */
  customErrorMessage?: string;
  /** Callback được gọi khi hành động bất đồng bộ thành công */
  onSuccess?: (data?: T) => void;
  /** Callback được gọi khi xảy ra lỗi */
  onError?: (errorMessage: string) => void;
}

/**
 * Custom hook thực thi và quản lý trạng thái cho một action bất đồng bộ (Async action execution).
 * Quản lý các trạng thái `loading`, `data`, `error` và cung cấp hàm `execute` và `reset`.
 *
 * @param actionFn - Hàm bất đồng bộ cần thực thi.
 * @param options - Tùy chọn callback onSuccess, onError và customErrorMessage.
 * @returns Đối tượng gồm loading, data, error, execute và reset.
 */
export function useAsyncAction<T>(
  actionFn: () => Promise<{ ok: boolean; data?: T; code?: string }>,
  options: UseAsyncActionOptions<T> = {},
) {
  const { customErrorMessage, onSuccess, onError } = options;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);

  const onSuccessRef = React.useRef(onSuccess);
  const onErrorRef = React.useRef(onError);

  React.useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const execute = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await actionFn();
      if (res && res.ok) {
        setData(res.data);
        onSuccessRef.current?.(res.data);
      } else {
        const msg = customErrorMessage || 'Thao tác thất bại';
        setError(msg);
        onErrorRef.current?.(msg);
      }
    } catch {
      const msg = customErrorMessage || 'Thao tác thất bại';
      setError(msg);
      onErrorRef.current?.(msg);
    } finally {
      setLoading(false);
    }
  }, [actionFn, customErrorMessage]);

  const reset = React.useCallback(() => {
    setLoading(false);
    setData(undefined);
    setError(null);
  }, []);

  return {
    loading,
    data,
    error,
    execute,
    reset,
  };
}
