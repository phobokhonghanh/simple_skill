import { getTranslations, setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import CashbackDashboardWrapper from '@/features/cashback/CashbackDashboardWrapper';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cashback' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function CashbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      {/* Load Google Identity Services client script statically in English to prevent script re-evaluation on locale changes */}
      <Script
        src="https://accounts.google.com/gsi/client?hl=en"
        strategy="afterInteractive"
      />

      {/* Main Cashback Portal Content */}
      <CashbackDashboardWrapper />
    </main>
  );
}

