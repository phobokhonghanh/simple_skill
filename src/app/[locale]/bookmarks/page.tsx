import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BookmarkDashboard } from '@/features/bookmarks/BookmarkDashboard';

/**
 * Sinh các tham số tĩnh cho các locale được hỗ trợ.
 *
 * @returns Mảng đối tượng tham số locale.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Tạo metadata động (Tiêu đề & Mô tả) cho trang Bookmarks dựa theo ngôn ngữ.
 *
 * @param props - Object chứa params Promise<{ locale: string }>.
 * @returns Metadata object.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookmarks' });

  return {
    title: t('meta.title') || 'Bookmarks | ndinhnguyen',
    description: t('meta.description') || 'Personal bookmark management application',
  };
}

/**
 * Trang Quản lý Bookmark cá nhân (BookmarksPage).
 *
 * @param props - Props chứa params locale.
 * @returns JSX Element BookmarkDashboard.
 */
export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BookmarkDashboard />;
}
