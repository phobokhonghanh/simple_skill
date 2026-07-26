'use client';

import { useTranslations } from 'next-intl';

/** Interface định nghĩa cấu trúc dữ liệu quá trình làm việc/kinh nghiệm */
interface ExperienceItem {
  /** Tên công ty/tổ chức */
  company: string;
  /** Vị trí/chức danh */
  role: string;
  /** Thời gian làm việc */
  period: string;
  /** Mô tả chi tiết công việc */
  description: string;
  /** Tên sản phẩm chính phụ trách (tùy chọn) */
  product?: string;
  /** Danh sách từ khóa công nghệ liên quan */
  tags: string[];
}

/**
 * Component ExperienceSection hiển thị danh sách các mốc kinh nghiệm làm việc theo dạng timeline dọc.
 * Đa ngôn ngữ i18n, hỗ trợ hiệu ứng hover và timelineResponsive cho cả mobile lẫn desktop.
 *
 * @returns JSX Element phần hiển thị kinh nghiệm làm việc.
 */
export function ExperienceSection() {
  const t = useTranslations('experience');

  const experiences: ExperienceItem[] = [
    {
      company: t('jobs.exp1.company'),
      role: t('jobs.exp1.role'),
      period: t('jobs.exp1.period'),
      product: t('jobs.exp1.product'),
      description: t('jobs.exp1.desc'),
      tags: [t('jobs.exp1.tag1'), t('jobs.exp1.tag2'), t('jobs.exp1.tag3')],
    },
    {
      company: t('jobs.exp2.company'),
      role: t('jobs.exp2.role'),
      period: t('jobs.exp2.period'),
      description: t('jobs.exp2.desc'),
      tags: [t('jobs.exp2.tag1'), t('jobs.exp2.tag2'), t('jobs.exp2.tag3')],
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Trang trí nền phía trên góc phải */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[var(--experience-accent-muted)] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative">
        {/* Tiêu đề phần Kinh nghiệm */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--experience-heading)] mb-4">
            {t('sections.experience.title')}
          </h2>
          <p className="text-[var(--experience-muted)]">
            {t('sections.experience.subtitle')}
          </p>
        </div>

        {/* Timeline danh sách các mốc thời gian */}
        <div className="relative pl-8 md:pl-0">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--experience-accent-border)] via-[var(--experience-accent-muted)] to-transparent md:-translate-x-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Dấu chấm mốc thời gian trên timeline */}
                <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-[var(--experience-accent)] border-4 border-[var(--experience-bg)] shadow-[0_0_10px_var(--experience-accent-glow)] -translate-x-1/2 z-10 hidden md:block" />

                {/* Khối thẻ thông tin chi tiết công việc */}
                <div className="md:w-1/2 space-y-4">
                  <div
                    className={`p-6 md:p-8 rounded-2xl bg-[var(--experience-surface)] border border-[var(--experience-border)] hover:border-[var(--experience-accent-border)] transition-all duration-500 group relative overflow-hidden backdrop-blur-sm`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--experience-accent-muted)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--experience-accent)]">
                          {exp.period}
                        </span>
                        <h3 className="text-xl font-bold text-[var(--experience-heading)]">
                          {exp.role}
                        </h3>
                      </div>

                      <div className="mb-4">
                        <div className="text-lg font-semibold text-[var(--experience-text)]">
                          {exp.company}
                        </div>
                        {exp.product && (
                          <div className="text-sm text-[var(--experience-muted)] italic">
                            {exp.product}
                          </div>
                        )}
                      </div>

                      <p className="text-[var(--experience-muted)] text-sm leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      {/* Danh sách các tag kỹ năng sử dụng */}
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-[var(--experience-accent-muted)] border border-[var(--experience-accent-border)] text-[10px] font-bold text-[var(--experience-accent)] uppercase tracking-tight"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
