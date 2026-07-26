'use client';

import * as React from 'react';
import {
  ToastContainer,
  type Toast,
  type ToastOptions,
  type ToastPosition,
  type ToastType,
} from '@/components/ui/toast';

/** Interface mô tả Context của hệ thống Toast notification */
interface ToastContextType {
  /** Danh sách các toast đang hiển thị */
  toasts: Toast[];
  /** Hàm thêm toast mới vào hàng chờ */
  addToast: (
    message: string,
    type: ToastType,
    options?: ToastOptions,
  ) => string;
  /** Hàm đóng/ẩn toast theo ID */
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

/**
 * Interface cho hàm trigger Toast với các shortcut helper.
 */
export interface ToastFunction {
  (message: string, options?: ToastOptions): string;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  custom: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}

/** Props của ToastProvider */
interface ToastProviderProps {
  /** Các component con bên trong ứng dụng */
  children: React.ReactNode;
  /** Vị trí hiển thị danh sách Toast (mặc định: 'bottom-right') */
  position?: ToastPosition;
}

/**
 * Provider quản lý hiển thị thông báo toàn cục (Global Toast Provider).
 * Lắng nghe và quản lý danh sách Toast notification, tự động render ToastContainer ở góc màn hình.
 *
 * @param props - ToastProviderProps bao gồm children và position.
 * @returns JSX Element bọc ToastContext.Provider và ToastContainer.
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (message: string, type: ToastType, options?: ToastOptions) => {
      const id = `toast-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type, options }]);
      return id;
    },
    [],
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({ toasts, addToast, dismiss }),
    [toasts, addToast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} position={position} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/**
 * Custom hook để gọi thông báo Toast ở bất kỳ đâu trong ứng dụng.
 * Cung cấp các tiện ích shortcut: `success`, `error`, `warning`, `info`, `custom`, và `dismiss`.
 *
 * @throws {Error} Ném ra lỗi nếu hook được gọi ngoài phạm vi ToastProvider.
 * @returns Đối tượng chứa các hàm kích hoạt Toast thông báo.
 */
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được sử dụng bên trong ToastProvider');
  }

  const toast = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return context.addToast(message, 'info', options);
    },
    [context],
  );

  const success = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return context.addToast(message, 'success', options);
    },
    [context],
  );

  const error = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return context.addToast(message, 'error', options);
    },
    [context],
  );

  const warning = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return context.addToast(message, 'warning', options);
    },
    [context],
  );

  const info = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return context.addToast(message, 'info', options);
    },
    [context],
  );

  const custom = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return context.addToast(message, 'custom', options);
    },
    [context],
  );

  const dismiss = React.useCallback(
    (id: string) => {
      context.dismiss(id);
    },
    [context],
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    custom,
    dismiss,
  };
}
