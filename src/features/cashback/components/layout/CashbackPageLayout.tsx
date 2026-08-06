'use client';

import * as React from 'react';
import { NavBar } from '@/features/cashback/NavBar';
import type { User } from '@/features/cashback/types';

export interface CashbackPageLayoutProps {
  user?: User | null;
  handleLogout?: () => void;
  onLoginClick?: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  className?: string;
}

/**
 * Layout wrapper chung cho tất cả các trang thuộc module Cashback.
 * Tự động bọc NavBar, theme background và padding chuẩn hóa.
 */
export function CashbackPageLayout({
  user,
  handleLogout,
  onLoginClick,
  children,
  maxWidthClass = 'max-w-6xl',
  className = '',
}: CashbackPageLayoutProps) {
  return (
    <div
      className={`affiliate-page-container relative overflow-x-hidden transition-colors duration-300 min-h-screen ${className}`}
    >
      {/* Sticky Header NavBar */}
      <NavBar
        user={user}
        handleLogout={handleLogout}
        onLoginClick={onLoginClick}
      />

      <div
        className={`${maxWidthClass} mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6`}
      >
        {children}
      </div>
    </div>
  );
}
