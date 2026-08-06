import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PaymentSettingDashboard } from '@/features/cashback/PaymentSettingDashboard';

/**
 * Sinh tham số tĩnh cho các locale được hỗ trợ.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Tạo metadata động cho trang Thiết lập thanh toán.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return {
    title: `${t('buttons.payment_setting')} — Cashback`,
    description: t('prompts.login_subtitle'),
  };
}

/**
 * Trang Thiết lập thanh toán (/cashback/payment-setting).
 */
export default async function PaymentSettingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <PaymentSettingDashboard />
    </main>
  );
}
