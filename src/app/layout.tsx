import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * Root Layout gốc của ứng dụng Next.js.
 * Cấu hình thẻ <html>, <body>, nạp font Google Fonts và CSS toàn cục `globals.css`.
 *
 * @param props - Props nhận vào children node đại diện cho trang web.
 * @returns JSX Element thẻ <html> và <body> bọc toàn hệ thống.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          geistSans.variable,
          geistMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
