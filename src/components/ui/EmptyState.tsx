import * as React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/** Props cho Component EmptyState */
export interface EmptyStateProps {
  /** Icon hiển thị trung tâm */
  icon?: LucideIcon;
  /** Tiêu đề màn hình rỗng */
  title: string;
  /** Mô tả chi tiết */
  description?: string;
  /** Nhãn cho nút hành động (ví dụ: "Tạo mới") */
  actionLabel?: string;
  /** Hàm callback khi click nút hành động */
  onAction?: () => void;
  /** Icon cho nút hành động */
  actionIcon?: LucideIcon;
  /** Class CSS bổ sung */
  className?: string;
}

/**
 * Component EmptyState hiển thị trạng thái rỗng chuẩn hóa theo quy tắc agent_ui.md.
 *
 * @param props - EmptyStateProps
 * @returns JSX Element của màn hình rỗng.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-card/40',
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-base font-semibold text-foreground tracking-tight sm:text-lg">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          variant="default"
          size="sm"
          className="mt-5"
        >
          {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
