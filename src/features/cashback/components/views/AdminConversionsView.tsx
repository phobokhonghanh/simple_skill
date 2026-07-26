'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Filter, AlertCircle, RotateCcw } from 'lucide-react';
import { DEFAULT_PAGE_SIZE } from '@/features/cashback/config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConversionsTable } from '@/features/cashback/components/tables/ConversionsTable';
import { FilterBar } from '@/features/cashback/components/input/FilterBar';
import { mapConversionToCashbackRecord } from '@/features/cashback/utils';
import { useAdminConversions } from '@/features/cashback/hooks';

/**
 * Component hiển thị giao diện báo cáo đơn chuyển đổi đối soát dành cho Quản trị viên (Admin).
 * Tự đóng gói logic nghiệp vụ với `useAdminConversions()` (0 Props).
 */
export function AdminConversionsView() {
  const t = useTranslations('cashback');
  const tCommon = useTranslations('common');
  const state = useAdminConversions();

  const mappedConversions = React.useMemo(() => {
    if (!state.conversions) return [];
    return state.conversions.map((rec) => mapConversionToCashbackRecord(rec));
  }, [state.conversions]);

  const handleSearch = () => {
    state.setPage(1);
    void state.fetchConversions();
  };

  return (
    <Card className="aff-card p-5 sm:p-6 rounded-2xl max-w-full overflow-hidden border-0 bg-transparent py-0 gap-0 shadow-none">
      <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2 border-b border-[var(--aff-border)] pb-3 mb-5">
        <Filter className="w-5 h-5 text-orange-500" />
        <span>{t('report.all_conversions')}</span>
      </h3>

      {/* FilterBar */}
      <FilterBar
        startDate={state.filterStart}
        onStartDateChange={state.setFilterStart}
        endDate={state.filterEnd}
        onEndDateChange={state.setFilterEnd}
        subId={state.filterSubId}
        onSubIdChange={state.setFilterSubId}
        onSearch={handleSearch}
        loading={state.loading}
        className="mb-6"
      />

      {state.error ? (
        <div className="py-12 px-4 text-center border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">
            {state.error}
          </p>
          <Button
            onClick={() => void state.fetchConversions()}
            variant="outline"
            className="aff-btn-secondary text-xs h-8 px-3 rounded-xl border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{tCommon('buttons.search')}</span>
          </Button>
        </div>
      ) : (
        <ConversionsTable
          records={mappedConversions}
          role="admin"
          loading={state.loading}
          pagination={{
            page: state.page,
            totalPages: state.totalPages,
            total: state.total,
            pageSize: DEFAULT_PAGE_SIZE,
          }}
          onPageChange={(p) => {
            state.setPage(p);
            void state.fetchConversions();
          }}
        />
      )}
    </Card>
  );
}
