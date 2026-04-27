'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Enterprise-grade Theme Provider wrapper for next-themes.
 * Supports light, dark, and system modes.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
