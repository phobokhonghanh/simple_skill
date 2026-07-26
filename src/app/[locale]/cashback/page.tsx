import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { CashbackDashboard } from '@/features/cashback/CashbackDashboard';

/**
 * Sinh tham số tĩnh cho các locale được hỗ trợ của phân hệ Cashback.
 *
 * @returns Mảng đối tượng chứa mã locale.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Tạo metadata động (Tiêu đề & Mô tả) cho trang Cashback.
 *
 * @param props - Object chứa params Promise<{ locale: string }>.
 * @returns Object Metadata.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cashback' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

/**
 * Trang Hoàn tiền mua sắm (CashbackPage).
 * Hiển thị giao diện chính `CashbackDashboard`.
 *
 * @param props - Props chứa params Promise<{ locale: string }>.
 * @returns JSX Element của trang Cashback.
 */
export default async function CashbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <CashbackDashboard />
    </main>
  );
}
