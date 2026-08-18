'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  CircleDollarSign,
} from 'lucide-react';
import type { User, CashbackTab, UserRole } from '@/features/cashback/types';
import { TabButton } from '@/features/cashback/components/buttons/TabButton';
import { ClientWrapper } from '@/components/ui/ClientWrapper';
import { useTabIndicator } from '@/features/cashback/hooks/useTabIndicator';
import { TabIndicator } from '@/features/cashback/components/TabIndicator';

interface HeaderProps {
  user: User | null;
  activeTab: CashbackTab;
  setActiveTab: (tab: CashbackTab) => void;
  resetUserHistoryPage?: () => void;
}

interface TabConfig {
  id: CashbackTab;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  requiredRole?: UserRole;
}

/**
 * Component hiển thị tiêu đề chính của trang hoàn tiền và thanh điều hướng các tab.
 * Hiển thị các tab dựa trên quyền hạn của người dùng đăng nhập.
 */
export function Header({
  user,
  activeTab,
  setActiveTab,
  resetUserHistoryPage,
}: HeaderProps) {
  const t = useTranslations('cashback');

  const titleWords = t('header.title').split(' ');
  const firstWord = titleWords[0] || '';
  const restWords = titleWords.slice(1).join(' ') || '';

  const { tabsRef, indicatorStyle } = useTabIndicator(activeTab, [user]);

  const tabConfigs: TabConfig[] = [
    {
      id: 'converter',
      labelKey: 'tabs.converter',
      icon: Sparkles,
    },
    {
      id: 'orders',
      labelKey: 'tabs.orders',
      icon: TrendingUp,
      onClick: resetUserHistoryPage,
    },
    {
      id: 'payment',
      labelKey: 'tabs.payment',
      icon: CircleDollarSign,
    },
    {
      id: 'admin',
      labelKey: 'tabs.admin',
      icon: ShieldCheck,
      requiredRole: 'admin',
    },
  ];

  return (
    <div className="w-full text-center">
      {/* Header Hero Section */}
      <div className="text-center mb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-3">
          <span>{t('common.platform_shopee')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          <span className="text-[var(--aff-text)]">{firstWord}</span>
          {restWords && (
            <span className="aff-gradient-text ml-2">{restWords}</span>
          )}
        </h1>
        <p className="text-sm sm:text-base text-[var(--aff-muted)]">
          {t('header.subtitle')}
        </p>
      </div>

      {/* Tab Switcher if logged in */}
      <ClientWrapper>
        {user && (
          <div className="relative inline-flex border-b border-[var(--aff-border)] mb-0 overflow-x-auto gap-2 pb-0 scrollbar-none max-w-full w-full justify-start sm:justify-center">
            {tabConfigs
              .filter(
                (tab) => !tab.requiredRole || user.role === tab.requiredRole,
              )
              .map((tab) => (
                <TabButton
                  key={tab.id}
                  ref={(el) => {
                    tabsRef.current[tab.id] = el;
                  }}
                  isActive={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.onClick) {
                      tab.onClick();
                    }
                  }}
                  icon={tab.icon}
                  label={t(tab.labelKey)}
                />
              ))}
            <TabIndicator {...indicatorStyle} />
          </div>
        )}
      </ClientWrapper>
    </div>
  );
}
