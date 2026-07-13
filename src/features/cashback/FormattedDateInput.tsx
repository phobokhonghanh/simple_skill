'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';

interface FormattedDateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  className?: string;
  required?: boolean;
}

export function FormattedDateInput({
  value,
  onChange,
  className = '',
  required = false,
}: FormattedDateInputProps) {
  const displayValue = React.useMemo(() => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  }, [value]);

  return (
    <div
      className={`relative flex items-center justify-between aff-input cursor-pointer rounded-xl bg-[var(--aff-surface)] border-2 border-[var(--aff-border)] transition-all duration-200 ${className}`}
    >
      <span className="select-none text-xs text-[var(--aff-text)] truncate pr-6">
        {displayValue || '--/--/----'}
      </span>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--aff-muted)]">
        <Calendar className="w-3.5 h-3.5" />
      </div>
      <input
        type="date"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            if ('showPicker' in e.currentTarget) {
              e.currentTarget.showPicker();
            }
          } catch {
            // Fallback for older browsers
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [color-scheme:dark] z-10"
      />
    </div>
  );
}
