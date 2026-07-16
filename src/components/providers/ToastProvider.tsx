'use client';

import * as React from 'react';
import {
  ToastContainer,
  type Toast,
  type ToastOptions,
  type ToastPosition,
  type ToastType,
} from '@/components/ui/toast';

interface ToastContextType {
  toasts: Toast[];
  addToast: (
    message: string,
    type: ToastType,
    options?: ToastOptions,
  ) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export interface ToastFunction {
  (message: string, options?: ToastOptions): string;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  custom: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
}

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

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
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
