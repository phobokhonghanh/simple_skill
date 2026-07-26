'use client';

import * as React from 'react';

interface TabIndicatorProps {
  left: number;
  width: number;
}

export function TabIndicator({ left, width }: TabIndicatorProps) {
  return (
    <div
      className="absolute bottom-0 h-[3px] bg-[var(--aff-orange)] transition-all duration-300 ease-in-out rounded-full"
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
    />
  );
}
