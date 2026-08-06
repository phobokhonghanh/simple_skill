'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export function TabButton({
  isActive,
  onClick,
  icon: Icon,
  label,
  ref,
}: TabButtonProps) {
  return (
    <Button
      ref={ref}
      variant="ghost"
      onClick={onClick}
      className={`h-auto px-4 py-2.5 font-semibold text-sm rounded-none transition-colors duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer bg-transparent hover:bg-transparent focus-visible:ring-0 active:translate-y-0 active:scale-100 ${
        isActive
          ? 'text-[var(--aff-orange)] font-bold hover:text-[var(--aff-orange)]'
          : 'text-[var(--aff-muted)] hover:text-[var(--aff-orange)]'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </Button>
  );
}
