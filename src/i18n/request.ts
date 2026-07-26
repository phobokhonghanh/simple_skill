import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { APP_TIME_ZONE } from '@/lib/runtime-config';

/**
 * Cấu hình xử lý yêu cầu i18n ở phía Server (Server-side request config).
 * Tự động tải file bản dịch JSON phù hợp (`en.json` hoặc `vi.json`) và áp dụng múi giờ ứng dụng.
 *
 * @param params - Đối tượng chứa requestLocale từ URL segment [locale].
 * @returns Cấu hình i18n gồm locale, messages dịch thuật và timeZone.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: APP_TIME_ZONE,
  };
});
