'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

// Silence the false-positive React 19 warning in development for next-themes inline script
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Encountered a script tag while rendering React component')
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function Providers({
  children,
  messages,
  locale,
  timeZone,
}: {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
  timeZone: string;
}) {
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
        {children}
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
}
