'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Filter, AlertCircle, RotateCcw } from 'lucide-react';
import type { ConversionRecord } from '@/features/cashback/types';
import { DEFAULT_PAGE_SIZE } from '@/features/cashback/config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConversionsTable } from '@/features/cashback/components/tables/ConversionsTable';
import { FilterBar } from '@/features/cashback/components/input/FilterBar';
import { mapConversionToCashbackRecord } from '@/features/cashback/utils';

interface AdminConversionsViewProps {
  adminConversions: ConversionRecord[];
  loadingAdminConversions: boolean;
  adminError: string | null;
  adminPage: number;
  setAdminPage: React.Dispatch<React.SetStateAction<number>>;
  adminTotal: number;
  adminTotalPages: number;
  filterSubId: string;
  setFilterSubId: (s: string) => void;
  filterStart: string;
  setFilterStart: (s: string) => void;
  filterEnd: string;
  setFilterEnd: (s: string) => void;
  fetchAdminConversions: () => void;
}

export function AdminConversionsView({
  adminConversions,
  loadingAdminConversions,
  adminError,
  adminPage,
  setAdminPage,
  adminTotal,
  adminTotalPages,
  filterSubId,
  setFilterSubId,
  filterStart,
  setFilterStart,
  filterEnd,
  setFilterEnd,
  fetchAdminConversions,
}: AdminConversionsViewProps) {
  const t = useTranslations('cashback');
  const tCommon = useTranslations('common');

  const mappedAdminConversions = React.useMemo(() => {
    if (!adminConversions) return [];
    return adminConversions.map((rec) => mapConversionToCashbackRecord(rec));
  }, [adminConversions]);

  const handleSearch = () => {
    setAdminPage(1);
    void fetchAdminConversions();
  };

  return (
    <Card className="aff-card p-5 sm:p-6 rounded-2xl max-w-full overflow-hidden border-0 bg-transparent py-0 gap-0 shadow-none">
      <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2 border-b border-[var(--aff-border)] pb-3 mb-5">
        <Filter className="w-5 h-5 text-orange-500" />
        <span>{t('report.all_conversions')}</span>
      </h3>

      {/* FilterBar */}
      <FilterBar
        startDate={filterStart}
        onStartDateChange={setFilterStart}
        endDate={filterEnd}
        onEndDateChange={setFilterEnd}
        subId={filterSubId}
        onSubIdChange={setFilterSubId}
        onSearch={handleSearch}
        loading={loadingAdminConversions}
        className="mb-6"
      />

      {adminError ? (
        <div className="py-12 px-4 text-center border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">
            {adminError}
          </p>
          <Button
            onClick={() => void fetchAdminConversions()}
            variant="outline"
            className="aff-btn-secondary text-xs h-8 px-3 rounded-xl border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{tCommon('buttons.search')}</span>
          </Button>
        </div>
      ) : (
        <ConversionsTable
          records={mappedAdminConversions}
          role="admin"
          loading={loadingAdminConversions}
          pagination={{
            page: adminPage,
            totalPages: adminTotalPages,
            total: adminTotal,
            pageSize: DEFAULT_PAGE_SIZE,
          }}
          onPageChange={(page) => {
            setAdminPage(page);
            void fetchAdminConversions();
          }}
        />
      )}
    </Card>
  );
}
