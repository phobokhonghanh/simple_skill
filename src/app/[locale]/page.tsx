import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { LanguageSwitcher } from '@/features/i18n/LanguageSwitcher';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { InfoBox } from '@/components/ui/info-box';

/**
 * Hàm sinh tham số tĩnh (Static Params) cho tất cả các locale được hỗ trợ ('en', 'vi').
 *
 * @returns Mảng các đối tượng chứa mã locale.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Trang chủ chính (IndexPage) hiển thị thẻ chào mừng, giới thiệu ngắn gọn và các điều hướng tính năng.
 *
 * @param props - Props nhận vào params Promise chứa locale hiện tại.
 * @returns JSX Element của trang chủ.
 */
export default async function IndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-24 bg-background transition-colors duration-300 gap-6">
      {/* Khối nút cài đặt nhanh (Đổi ngôn ngữ & Theme) ở góc trên bên phải */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Thẻ nội dung giới thiệu chính */}
      <Card className="w-full max-w-[600px] shadow-2xl border-t-4 border-t-primary animate-in fade-in zoom-in duration-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg italic mt-1">
            {t('rule')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <InfoBox
            title={t('welcome')}
            description={t('description')}
            className="shadow-sm"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoBox
              title={t('experience.title')}
              description={t('experience.desc')}
              href="/experience"
              className="h-full"
            />
            <InfoBox
              title={t('homelab.title')}
              description={t('homelab.desc')}
              href="#"
              className="h-full"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
