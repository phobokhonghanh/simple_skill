'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

// Lược bỏ cảnh báo giả lập React 19 liên quan đến script tag thẻ theme trong môi trường dev
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes(
        'Encountered a script tag while rendering React component',
      )
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

/** Props cho Component tổng hợp Providers */
export interface ProvidersProps {
  /** Các component con toàn ứng dụng */
  children: React.ReactNode;
  /** Bản dịch i18n client */
  messages: AbstractIntlMessages;
  /** Mã ngôn ngữ hiện tại ('en' hoặc 'vi') */
  locale: string;
  /** Múi giờ ứng dụng */
  timeZone: string;
}

/**
 * Root Providers tổng hợp bọc toàn bộ ứng dụng.
 * Bao gồm các Provider: NextThemesProvider (Giao diện Dark/Light), NextIntlClientProvider (Đa ngôn ngữ),
 * ToastProvider (Thông báo Toast) và AuthProvider (Xác thực người dùng).
 *
 * @param props - Custom ProvidersProps gồm children, messages, locale và timeZone.
 * @returns JSX Element cấu trúc tầng các Provider lồng nhau.
 */
export function Providers({
  children,
  messages,
  locale,
  timeZone,
}: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
      >
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
}
