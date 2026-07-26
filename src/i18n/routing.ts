import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Cấu hình định tuyến đa ngôn ngữ (i18n) cho ứng dụng Next.js.
 * Bao gồm danh sách ngôn ngữ hỗ trợ ('en', 'vi') và ngôn ngữ mặc định ('en').
 */
export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
});

/**
 * Các wrapper điều hướng i18n tích hợp cấu hình routing của next-intl.
 * Bao gồm: Link, redirect, usePathname, useRouter, getPathname.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
