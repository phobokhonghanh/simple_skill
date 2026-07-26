'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { DEFAULT_PAGE_SIZE } from '@/features/cashback/config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConversionsTable } from '@/features/cashback/components/tables/ConversionsTable';
import { FilterBar } from '@/features/cashback/components/input/FilterBar';
import { useAdminCashbacks } from '@/features/cashback/hooks';

/**
 * Component hiển thị danh sách Cashback hoàn tiền của tất cả người dùng dành cho Quản trị viên (Admin).
 * Tự đóng gói logic nghiệp vụ với `useAdminCashbacks()` (0 Props).
 */
export function AdminCashbacksView() {
  const tCommon = useTranslations('common');
  const state = useAdminCashbacks();

  const handleSearch = () => {
    state.setPage(1);
    void state.fetchCashbacks();
  };

  return (
    <Card className="aff-card p-4 sm:p-5 rounded-2xl max-w-full overflow-hidden border-0 bg-transparent py-0 gap-0 shadow-none">
      {/* Search FilterBar */}
      <FilterBar
        userId={state.searchUserId}
        onUserIdChange={state.setSearchUserId}
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
            onClick={() => void state.fetchCashbacks()}
            variant="outline"
            className="aff-btn-secondary text-xs h-8 px-3 rounded-xl border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{tCommon('buttons.search')}</span>
          </Button>
        </div>
      ) : (
        <ConversionsTable
          records={state.cashbacks}
          role="admin"
          loading={state.loading}
          pagination={{
            page: state.page,
            totalPages: state.totalPages,
            total: state.total,
            pageSize: DEFAULT_PAGE_SIZE,
          }}
          onPageChange={state.setPage}
        />
      )}
    </Card>
  );
}
