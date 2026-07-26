'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, ShieldCheck, RotateCw } from 'lucide-react';
import type { AdminSubTab } from '@/features/cashback/types';
import { AdminConversionsView } from '@/features/cashback/components/views/AdminConversionsView';
import { AdminCashbacksView } from '@/features/cashback/components/views/AdminCashbacksView';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateInput } from '@/features/cashback/components/input/DateInput';
import { ClientWrapper } from '@/components/ui/ClientWrapper';
import { TabButton } from '@/features/cashback/components/buttons/TabButton';
import { TabIndicator } from '@/features/cashback/components/TabIndicator';
import { useTabIndicator, useAdminSync } from '@/features/cashback/hooks';

/**
 * Component hiển thị giao diện cổng quản trị viên (Admin Portal) của module hoàn tiền.
 * Kết hợp mô hình Lazy-Mounted Keep-Alive:
 * - Lazy Fetch: Chỉ khởi tạo và gọi API của sub-tab khi người dùng bấm mở lần đầu tiên.
 * - Cache RAM: Sau khi đã mở, duy trì component trong DOM (CSS hidden) để phản hồi 0ms và giữ state.
 * - Clean Architecture: 0 Props truyền từ ngoài vào.
 */
export function AdminTab() {
  const t = useTranslations('cashback');
  const [adminSubTab, setAdminSubTab] =
    React.useState<AdminSubTab>('conversions');

  // Đánh dấu các subtab đã từng được người dùng truy cập
  const [visitedTabs, setVisitedTabs] = React.useState<Record<string, boolean>>({
    conversions: true, // Subtab mặc định nạp lần đầu
  });

  const handleSubTabChange = (tab: AdminSubTab) => {
    setAdminSubTab(tab);
    setVisitedTabs((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
  };

  const {
    syncStart,
    setSyncStart,
    syncEnd,
    setSyncEnd,
    syncSubId,
    setSyncSubId,
    syncLoading,
    handleAdminSync,
  } = useAdminSync();

  const { tabsRef, indicatorStyle } = useTabIndicator(adminSubTab);

  return (
    <ClientWrapper>
      <div className="space-y-6">
        {/* Thanh chuyển Subtab (Conversions / Cashbacks) */}
        <div className="relative inline-flex border-b border-[var(--aff-border)] mb-6 overflow-x-auto gap-2 pb-0 scrollbar-none max-w-full">
          <TabButton
            ref={(el) => {
              tabsRef.current['conversions'] = el;
            }}
            isActive={adminSubTab === 'conversions'}
            onClick={() => handleSubTabChange('conversions')}
            label={t('tabs.admin_conversions')}
          />
          <TabButton
            ref={(el) => {
              tabsRef.current['cashbacks'] = el;
            }}
            isActive={adminSubTab === 'cashbacks'}
            onClick={() => handleSubTabChange('cashbacks')}
            label={t('tabs.admin_cashbacks')}
          />

          <TabIndicator {...indicatorStyle} />
        </div>

        {/* Subtab 1: Form Đồng bộ Shopee & Bảng Đơn Chuyển Đổi Đối Soát */}
        {visitedTabs.conversions && (
          <div className={adminSubTab === 'conversions' ? 'space-y-6' : 'hidden'}>
            <Card className="aff-card p-5 sm:p-6 rounded-2xl border-0 bg-transparent py-0 gap-0 shadow-none">
              <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2 border-b border-[var(--aff-border)] pb-3 mb-5">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <span>{t('sync.shopee_conversions')}</span>
              </h3>

              <form
                onSubmit={handleAdminSync}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
              >
                <DateInput
                  required
                  label={t('common.from_date')}
                  showLabelIcon
                  value={syncStart}
                  onChange={setSyncStart}
                  className="w-full px-3 py-2 text-xs sm:text-sm"
                  labelClassName="text-xs"
                />

                <DateInput
                  required
                  label={t('common.to_date')}
                  showLabelIcon
                  value={syncEnd}
                  onChange={setSyncEnd}
                  className="w-full px-3 py-2 text-xs sm:text-sm"
                  labelClassName="text-xs"
                />

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[var(--aff-muted)]">
                    {t('common.sub_id')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('filters.sub_id_placeholder')}
                    value={syncSubId}
                    onChange={(e) => setSyncSubId(e.target.value)}
                    className="aff-input w-full px-3 py-2 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <Button
                    type="submit"
                    disabled={syncLoading}
                    className="aff-btn-primary w-full h-[38px] rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {syncLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('sync.syncing')}</span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4" />
                        <span>{t('sync.now')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            {/* View Báo cáo đơn đối soát (0 Props, duy trì state & cache) */}
            <AdminConversionsView />
          </div>
        )}

        {/* Subtab 2: Bảng Quản lý Cashback Người Dùng (Lazy-Fetch khi bấm mở lần đầu, Giữ Cache RAM khi ẩn) */}
        {visitedTabs.cashbacks && (
          <div className={adminSubTab === 'cashbacks' ? 'block' : 'hidden'}>
            <AdminCashbacksView />
          </div>
        )}
      </div>
    </ClientWrapper>
  );
}
