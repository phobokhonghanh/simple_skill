'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  CircleDollarSign,
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

  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });
  const tabsRef = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});

  React.useEffect(() => {
    const activeEl = tabsRef.current[activeTab];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab, user]);

  React.useEffect(() => {
    const handleResize = () => {
      const activeEl = tabsRef.current[activeTab];
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

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
          {restWords && (
            <span className="aff-gradient-text ml-2">{restWords}</span>
          )}
        </h1>
        <p className="text-sm sm:text-base text-[var(--aff-muted)]">
          {t('subtitle')}
        </p>
      </div>

      {/* Tab Switcher if logged in */}
      {user && (
        <div className="relative inline-flex border-b border-[var(--aff-border)] mb-6 overflow-x-auto gap-2 pb-0 scrollbar-none max-w-full">
          <Button
            ref={(el) => {
              tabsRef.current['converter'] = el;
            }}
            variant="ghost"
            onClick={() => setActiveTab('converter')}
            className={`h-auto px-4 py-2.5 font-semibold text-sm rounded-none transition-colors duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer bg-transparent hover:bg-transparent focus-visible:ring-0 active:translate-y-0 active:scale-100 ${
              activeTab === 'converter'
                ? 'text-[var(--aff-orange)] font-bold'
                : 'text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('converter_tab')}</span>
          </Button>
          <Button
            ref={(el) => {
              tabsRef.current['history'] = el;
            }}
            variant="ghost"
            onClick={() => {
              setActiveTab('history');
              resetUserHistoryPage();
            }}
            className={`h-auto px-4 py-2.5 font-semibold text-sm rounded-none transition-colors duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer bg-transparent hover:bg-transparent focus-visible:ring-0 active:translate-y-0 active:scale-100 ${
              activeTab === 'history'
                ? 'text-[var(--aff-orange)] font-bold'
                : 'text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('history_tab')}</span>
          </Button>
          <Button
            ref={(el) => {
              tabsRef.current['payment'] = el;
            }}
            variant="ghost"
            onClick={() => setActiveTab('payment')}
            className={`h-auto px-4 py-2.5 font-semibold text-sm rounded-none transition-colors duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer bg-transparent hover:bg-transparent focus-visible:ring-0 active:translate-y-0 active:scale-100 ${
              activeTab === 'payment'
                ? 'text-[var(--aff-orange)] font-bold'
                : 'text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
            }`}
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>{t('payment_tab')}</span>
          </Button>
          {user.role === 'admin' && (
            <Button
              ref={(el) => {
                tabsRef.current['admin'] = el;
              }}
              variant="ghost"
              onClick={() => setActiveTab('admin')}
              className={`h-auto px-4 py-2.5 font-semibold text-sm rounded-none transition-colors duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer bg-transparent hover:bg-transparent focus-visible:ring-0 active:translate-y-0 active:scale-100 ${
                activeTab === 'admin'
                  ? 'text-[var(--aff-orange)] font-bold'
                  : 'text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('admin_tab')}</span>
            </Button>
          )}

          {/* Smooth sliding bottom indicator */}
          <div
            className="absolute bottom-0 h-[3px] bg-[var(--aff-orange)] transition-all duration-300 ease-in-out rounded-full"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      )}
    </div>
  );
}
