'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  CircleDollarSign
} from 'lucide-react';
import type { User } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  user: User | null;
  activeTab: 'converter' | 'history' | 'payment' | 'admin';
  setActiveTab: (tab: 'converter' | 'history' | 'payment' | 'admin') => void;
  resetUserHistoryPage: () => void;
}

export function DashboardHeader({
  user,
  activeTab,
  setActiveTab,
  resetUserHistoryPage,
}: DashboardHeaderProps) {
  const t = useTranslations('cashback');

  const titleWords = t('title').split(' ');
  const firstWord = titleWords[0] || '';
  const restWords = titleWords.slice(1).join(' ') || '';

  return (
    <div className="w-full text-center">
      {/* Header Hero Section */}
      <div className="text-center mb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Shopee Cashback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          <span className="text-[var(--aff-text)]">{firstWord}</span>
          {restWords && <span className="aff-gradient-text ml-2">{restWords}</span>}
        </h1>
        <p className="text-sm sm:text-base text-[var(--aff-muted)]">
          {t('subtitle')}
        </p>
      </div>

      {/* Tab Switcher if logged in */}
      {user && (
        <div className="flex border-b border-[var(--aff-border)] mb-6 overflow-x-auto gap-2 scrollbar-none">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('converter')}
            className={`h-auto px-4 py-2.5 font-semibold text-sm border-b-2 rounded-none transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-transparent ${
              activeTab === 'converter'
                ? 'border-[var(--aff-orange)] text-[var(--aff-orange)] font-bold'
                : 'border-transparent text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('converter_tab')}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab('history');
              resetUserHistoryPage();
            }}
            className={`h-auto px-4 py-2.5 font-semibold text-sm border-b-2 rounded-none transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-transparent ${
              activeTab === 'history'
                ? 'border-[var(--aff-orange)] text-[var(--aff-orange)] font-bold'
                : 'border-transparent text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('history_tab')}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('payment')}
            className={`h-auto px-4 py-2.5 font-semibold text-sm border-b-2 rounded-none transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-transparent ${
              activeTab === 'payment'
                ? 'border-[var(--aff-orange)] text-[var(--aff-orange)] font-bold'
                : 'border-transparent text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
            }`}
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>{t('payment_tab')}</span>
          </Button>
          {user.role === 'admin' && (
            <Button
              variant="ghost"
              onClick={() => setActiveTab('admin')}
              className={`h-auto px-4 py-2.5 font-semibold text-sm border-b-2 rounded-none transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-transparent ${
                activeTab === 'admin'
                  ? 'border-[var(--aff-orange)] text-[var(--aff-orange)] font-bold'
                  : 'border-transparent text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('admin_tab')}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
