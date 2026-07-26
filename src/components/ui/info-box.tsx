import * as React from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/** Props của Component InfoBox */
export interface InfoBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tiêu đề chính của hộp thông tin */
  title?: string;
  /** Nội dung mô tả chi tiết (hỗ trợ ngắt dòng \n) */
  description?: string;
  /** Đường dẫn liên kết khi nhấn vào hộp thông tin */
  href?: string;
  /** Mở liên kết ở thẻ mới (target="_blank") nếu là true */
  external?: boolean;
}

/**
 * Component InfoBox hiển thị khối thông tin nổi bật hỗ trợ gắn liên kết tùy chọn.
 *
 * @param props - InfoBoxProps bao gồm title, description, href, external và className.
 * @returns JSX Element khối nội dung InfoBox hoặc thẻ liên kết bọc ngoài.
 */
export function InfoBox({
  title,
  description,
  href,
  external,
  className,
  children,
  ...props
}: InfoBoxProps) {
  const content = (
    <div
      className={cn(
        'p-6 rounded-xl bg-muted/30 border border-border transition-all duration-300 hover:bg-muted/50',
        href && 'hover:border-primary/50 cursor-pointer',
        className,
      )}
      {...props}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-2 text-foreground tracking-tight">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </div>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block no-underline"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
