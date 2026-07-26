'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  className?: string;
  required?: boolean;
  label?: string; // Nhãn hiển thị phía trên input
  labelClassName?: string; // Class tùy chỉnh cho label
  showLabelIcon?: boolean; // Hiển thị icon Calendar bên cạnh nhãn
}

export function DateInput({
  value,
  onChange,
  className = '',
  required = false,
  label,
  labelClassName = '',
  showLabelIcon = false,
}: DateInputProps) {
  const displayValue = React.useMemo(() => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
  }, [value]);

  const inputEl = (
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

  if (label) {
    return (
      <div className="space-y-1.5 text-left">
        <label
          className={`text-2xs font-bold text-[var(--aff-muted)] tracking-wider flex items-center gap-1 ${labelClassName}`}
        >
          {showLabelIcon && (
            <Calendar className="w-3.5 h-3.5 text-[var(--aff-muted)]" />
          )}
          <span>{label}</span>
        </label>
        {inputEl}
      </div>
    );
  }

  return inputEl;
}
