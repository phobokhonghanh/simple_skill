'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, RotateCcw } from 'lucide-react';
import type { CashbackRecord } from '@/features/cashback/types';
import { DEFAULT_PAGE_SIZE } from '@/features/cashback/config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConversionsTable } from '@/features/cashback/components/tables/ConversionsTable';
import { FilterBar } from '@/features/cashback/components/input/FilterBar';

interface AdminCashbacksViewProps {
  adminCashbacks: CashbackRecord[];
  loadingAdminCashbacks: boolean;
  adminCashbacksError: string | null;
  adminCashbacksPage: number;
  setAdminCashbacksPage: React.Dispatch<React.SetStateAction<number>>;
  adminCashbacksTotal: number;
  adminCashbacksTotalPages: number;
  searchUserId: string;
  setSearchUserId: (s: string) => void;
  fetchAdminCashbacks: () => void;
}

export function AdminCashbacksView({
  adminCashbacks,
  loadingAdminCashbacks,
  adminCashbacksError,
  adminCashbacksPage,
  setAdminCashbacksPage,
  adminCashbacksTotal,
  adminCashbacksTotalPages,
  searchUserId,
  setSearchUserId,
  fetchAdminCashbacks,
}: AdminCashbacksViewProps) {
  const tCommon = useTranslations('common');

  const handleSearch = () => {
    setAdminCashbacksPage(1);
    void fetchAdminCashbacks();
  };

  return (
    <Card className="aff-card p-4 sm:p-5 rounded-2xl max-w-full overflow-hidden border-0 bg-transparent py-0 gap-0 shadow-none">
      {/* Search FilterBar */}
      <FilterBar
        userId={searchUserId}
        onUserIdChange={setSearchUserId}
        onSearch={handleSearch}
        loading={loadingAdminCashbacks}
        className="mb-6"
      />

      {adminCashbacksError ? (
        <div className="py-12 px-4 text-center border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">
            {adminCashbacksError}
          </p>
          <Button
            onClick={() => void fetchAdminCashbacks()}
            variant="outline"
            className="aff-btn-secondary text-xs h-8 px-3 rounded-xl border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{tCommon('buttons.search')}</span>
          </Button>
        </div>
      ) : (
        <ConversionsTable
          records={adminCashbacks}
          role="admin"
          loading={loadingAdminCashbacks}
          pagination={{
            page: adminCashbacksPage,
            totalPages: adminCashbacksTotalPages,
            total: adminCashbacksTotal,
            pageSize: DEFAULT_PAGE_SIZE,
          }}
          onPageChange={setAdminCashbacksPage}
        />
      )}
    </Card>
  );
}
