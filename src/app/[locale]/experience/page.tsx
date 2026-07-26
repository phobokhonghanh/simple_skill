import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { NavBar } from '@/features/experience/NavBar';
import { HeroSection } from '@/features/experience/HeroSection';
import { TechStackSection } from '@/features/experience/TechStackSection';
import { ExperienceSection } from '@/features/experience/ExperienceSection';

/**
 * Sinh tham số tĩnh (Static Params) cho phân hệ Experience.
 *
 * @returns Mảng đối tượng chứa mã locale.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Tạo metadata động (Tiêu đề & Mô tả) cho trang Experience dựa trên ngôn ngữ chọn.
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
  const t = await getTranslations({ locale, namespace: 'experience' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

/**
 * Trang thông tin Kinh nghiệm & Kỹ năng cá nhân (ExperiencePage).
 * Tổ chức các sub-components: `NavBar` (Đầu trang), `HeroSection` (Giới thiệu), `TechStackSection` (Kỹ năng & Chứng chỉ) và `ExperienceSection` (Timeline quá trình làm việc).
 *
 * @param props - Props nhận vào params Promise<{ locale: string }>.
 * @returns JSX Element của trang Experience.
 */
export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      className="experience-page min-h-screen overflow-x-hidden bg-[var(--experience-bg)]"
      id="top"
    >
      {/* Nền trang trí lưới điểm ngầm (Dot-grid background) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage:
            'radial-gradient(var(--experience-accent-border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Thanh điều hướng Sticky Header */}
      <NavBar />

      {/* Khối Hero & Kỹ năng công nghệ */}
      <section className="relative z-10 container mx-auto max-w-6xl px-6 py-10 lg:py-14 clearfix">
        <div className="w-full lg:w-[320px] xl:w-[340px] lg:float-left lg:mr-10 xl:mr-14 mb-10">
          <HeroSection />
        </div>

        <div className="block">
          <TechStackSection />
        </div>
      </section>

      {/* Khối Timeline Kinh nghiệm làm việc */}
      <div
        className="relative z-10 clear-both bg-[var(--experience-bg)]"
        id="contact"
      >
        <ExperienceSection />
      </div>
    </main>
  );
}
