'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  CERTIFICATIONS,
  type Certification,
} from '@/features/experience/data/certifications';
import {
  TECH_SKILLS,
  type TechSkill,
} from '@/features/experience/data/techSkills';

/** Props cho Component TechSkillCard */
interface TechSkillCardProps {
  /** Thông tin kỹ năng công nghệ bao gồm tên, icon và link tham chiếu */
  skill: TechSkill;
}

/**
 * Sub-component hiển thị một thẻ Kỹ năng công nghệ (Tech Skill) đơn lẻ với biểu tượng icon và tên kỹ năng.
 *
 * @param props - TechSkillCardProps chứa đối tượng skill.
 * @returns JSX Element thẻ kỹ năng.
 */
function TechSkillCard({ skill }: TechSkillCardProps) {
  return (
    <li className="inline-flex m-1.5 align-top w-[calc(33.333%-12px)] sm:w-[100px] lg:w-[110px]">
      <a
        href={skill.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex flex-col items-center justify-center gap-2 p-3 rounded-2xl
                   bg-[var(--experience-surface)] border border-[var(--experience-border)] backdrop-blur-sm
                   shadow-sm hover:shadow-md
                   hover:-translate-y-0.5 hover:border-[var(--experience-accent-border)] hover:bg-[var(--experience-surface-hover)]
                   transition-all duration-200 cursor-pointer
                   w-full aspect-square"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2 group-hover:scale-105 transition-transform duration-200">
          <Image
            src={skill.iconSrc}
            alt={skill.name}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        </div>
        <span className="text-[11px] font-semibold text-[var(--experience-muted)] group-hover:text-[var(--experience-heading)] text-center leading-tight">
          {skill.name}
        </span>
      </a>
    </li>
  );
}

/** Props cho Component CertificationBadge */
interface CertificationBadgeProps {
  /** Thông tin chứng chỉ */
  certification: Certification;
  /** Nhãn nút bấm xem chi tiết */
  detailsLabel: string;
}

/**
 * Sub-component hiển thị một chứng chỉ chuyên môn (Certification) kèm hình ảnh minh họa và liên kết xác thực.
 *
 * @param props - CertificationBadgeProps chứa thông tin chứng chỉ và nhãn xem chi tiết.
 * @returns JSX Element thẻ chứng chỉ.
 */
function CertificationBadge({
  certification,
  detailsLabel,
}: CertificationBadgeProps) {
  return (
    <li className="min-w-0">
      <article
        className="grid h-full grid-cols-1 gap-4 rounded-2xl border border-[var(--experience-border)] bg-[var(--experience-surface)] p-4 shadow-sm backdrop-blur-sm
                   transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--experience-accent-border)] hover:bg-[var(--experience-surface-hover)] hover:shadow-md lg:grid-cols-[minmax(0,1fr)_minmax(160px,220px)] lg:items-center"
      >
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-[var(--experience-heading)]">
            {certification.name}
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-[var(--experience-muted)]">
            {certification.description}
          </p>
        </div>

        <div className="min-w-0">
          <div className="relative aspect-[548/387] w-full overflow-hidden rounded-xl bg-white">
            <Image
              src={certification.image}
              alt={certification.name}
              fill
              sizes="(min-width: 1024px) 220px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <a
            href={certification.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-xs font-semibold text-[var(--experience-accent)] transition-colors hover:text-[var(--experience-accent-hover)]"
          >
            {detailsLabel}
          </a>
        </div>
      </article>
    </li>
  );
}

/**
 * Component TechStackSection hiển thị toàn bộ kỹ năng công nghệ (Tech Stack) và các chứng chỉ đạt được.
 *
 * @returns JSX Element phần thông tin Kỹ năng & Chứng chỉ.
 */
export function TechStackSection() {
  const t = useTranslations('experience');

  return (
    <div className="block">
      {/* Tiêu đề danh sách Kỹ năng công nghệ */}
      <h2 className="text-xl font-black text-[var(--experience-heading)] tracking-wide uppercase mb-6 block">
        {t('skills.title')}
      </h2>

      {/* Grid danh sách các TechSkillCard */}
      <ul className="block" aria-label={t('skills.title')}>
        {TECH_SKILLS.map((skill) => (
          <TechSkillCard key={skill.name} skill={skill} />
        ))}
      </ul>

      {/* Danh sách Chứng chỉ chuyên môn */}
      <div className="clear-both pt-8">
        <h3 className="mb-3 block text-sm font-black uppercase tracking-wide text-[var(--experience-heading)]">
          {t('certifications.title')}
        </h3>

        <ul
          className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,420px),520px))] gap-3"
          aria-label={t('certifications.title')}
        >
          {CERTIFICATIONS.map((certification) => (
            <CertificationBadge
              key={certification.name}
              certification={certification}
              detailsLabel={t('certifications.view_details')}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
