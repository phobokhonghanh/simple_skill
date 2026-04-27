import * as React from 'react';
import { cn } from '@/lib/utils';

interface SettingBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

/**
 * SettingBox component - A standardized box for simple settings items.
 *
 * @param label - The label displayed above the content.
 */
export function SettingBox({
  label,
  children,
  className,
  ...props
}: SettingBoxProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-card border shadow-sm flex flex-col items-center gap-2',
        className,
      )}
      {...props}
    >
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
        {label}
      </span>
      {children}
    </div>
  );
}
