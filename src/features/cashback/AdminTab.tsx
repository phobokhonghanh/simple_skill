'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Calendar,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import type { ConversionRecord, CashbackRecord } from '@/features/cashback/types';
import { AdminConversionsView } from '@/features/cashback/AdminConversionsView';
import { AdminCashbacksView } from '@/features/cashback/AdminCashbacksView';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AdminTabProps {
  token: string | null;
  adminSubTab: 'conversions' | 'cashbacks';
  setAdminSubTab: (t: 'conversions' | 'cashbacks') => void;
  syncStart: string;
  setSyncStart: (s: string) => void;
  syncEnd: string;
  setSyncEnd: (s: string) => void;
  syncSubId: string;
  setSyncSubId: (s: string) => void;
  syncLoading: boolean;
  syncMessage: string | null;
  syncSuccess: boolean;
  setSyncMessage: (m: string | null) => void;
  handleAdminSync: (e: React.FormEvent) => void;

  // Conversions View Props
  adminConversions: ConversionRecord[];
  loadingAdminConversions: boolean;
  adminError: string | null;
  adminPage: number;
  setAdminPage: React.Dispatch<React.SetStateAction<number>>;
  adminTotal: number;
  adminTotalPages: number;
  expandedAdminRecordId: string | null;
  setExpandedAdminRecordId: (id: string | null) => void;
  filterSubId: string;
  setFilterSubId: (s: string) => void;
  filterStart: string;
  setFilterStart: (s: string) => void;
  filterEnd: string;
  setFilterEnd: (s: string) => void;
  fetchAdminConversions: () => void;

  // Cashbacks View Props
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

export function AdminTab({
  adminSubTab,
  setAdminSubTab,
  syncStart,
  setSyncStart,
  syncEnd,
  setSyncEnd,
  syncSubId,
  setSyncSubId,
  syncLoading,
  syncMessage,
  syncSuccess,
  handleAdminSync,

  adminConversions,
  loadingAdminConversions,
  adminError,
  adminPage,
  setAdminPage,
  adminTotal,
  adminTotalPages,
  expandedAdminRecordId,
  setExpandedAdminRecordId,
  filterSubId,
  setFilterSubId,
  filterStart,
  setFilterStart,
  filterEnd,
  setFilterEnd,
  fetchAdminConversions,

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
}: AdminTabProps) {
  const t = useTranslations('cashback');

  return (
    <div className="space-y-6">
      {/* Subtab selection */}
      <div className="flex border-b border-[var(--aff-border)] pb-0.5 mb-6 overflow-x-auto gap-2 scrollbar-none">
        <Button
          variant="ghost"
          onClick={() => {
            setAdminSubTab('conversions');
            setAdminPage(1);
          }}
          className={`h-auto px-4 py-2 font-bold text-xs border-b-2 rounded-none transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:bg-transparent ${
            adminSubTab === 'conversions'
              ? 'border-[var(--aff-orange)] text-[var(--aff-orange)]'
              : 'border-transparent text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
          }`}
        >
          <span>{t('admin_conversions_subtab')}</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setAdminSubTab('cashbacks');
            setAdminCashbacksPage(1);
          }}
          className={`h-auto px-4 py-2 font-bold text-xs border-b-2 rounded-none transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:bg-transparent ${
            adminSubTab === 'cashbacks'
              ? 'border-[var(--aff-orange)] text-[var(--aff-orange)]'
              : 'border-transparent text-[var(--aff-muted)] hover:text-[var(--aff-text)]'
          }`}
        >
          <span>{t('admin_cashbacks_subtab')}</span>
        </Button>
      </div>

      {adminSubTab === 'conversions' && (
        <div className="space-y-6">
          {/* Sync trigger cards */}
          <Card className="aff-card p-5 sm:p-6 rounded-2xl border-0 bg-transparent py-0 gap-0 shadow-none">
            <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)] flex items-center gap-2 border-b border-[var(--aff-border)] pb-3 mb-5">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>{t('sync_shopee_conversions')}</span>
            </h3>

            <form onSubmit={handleAdminSync} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-[var(--aff-muted)] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('sync_start_time')}</span>
                </label>
                <input
                  type="date"
                  required
                  value={syncStart}
                  onChange={(e) => setSyncStart(e.target.value)}
                  className="aff-input w-full px-3 py-2 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-[var(--aff-muted)] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('sync_end_time')}</span>
                </label>
                <input
                  type="date"
                  required
                  value={syncEnd}
                  onChange={(e) => setSyncEnd(e.target.value)}
                  className="aff-input w-full px-3 py-2 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-[var(--aff-muted)]">
                  {t('sync_sub_id')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. user_1234"
                  value={syncSubId}
                  onChange={(e) => setSyncSubId(e.target.value)}
                  className="aff-input w-full px-3 py-2 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="md:col-span-3 pt-2">
                <Button
                  type="submit"
                  disabled={syncLoading}
                  className="aff-btn-primary w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {syncLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang đồng bộ...</span>
                    </>
                  ) : (
                    <>
                      <RotateCw className="w-4 h-4" />
                      <span>{t('sync_now')}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>

            {syncMessage && (
              <div
                className={`mt-4 p-4 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm animate-in fade-in duration-300 ${
                  syncSuccess
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                }`}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{syncMessage}</span>
              </div>
            )}
          </Card>

          {/* Render sub-view */}
          <AdminConversionsView
            adminConversions={adminConversions}
            loadingAdminConversions={loadingAdminConversions}
            adminError={adminError}
            adminPage={adminPage}
            setAdminPage={setAdminPage}
            adminTotal={adminTotal}
            adminTotalPages={adminTotalPages}
            expandedAdminRecordId={expandedAdminRecordId}
            setExpandedAdminRecordId={setExpandedAdminRecordId}
            filterSubId={filterSubId}
            setFilterSubId={setFilterSubId}
            filterStart={filterStart}
            setFilterStart={setFilterStart}
            filterEnd={filterEnd}
            setFilterEnd={setFilterEnd}
            fetchAdminConversions={fetchAdminConversions}
          />
        </div>
      )}

      {adminSubTab === 'cashbacks' && (
        <AdminCashbacksView
          adminCashbacks={adminCashbacks}
          loadingAdminCashbacks={loadingAdminCashbacks}
          adminCashbacksError={adminCashbacksError}
          adminCashbacksPage={adminCashbacksPage}
          setAdminCashbacksPage={setAdminCashbacksPage}
          adminCashbacksTotal={adminCashbacksTotal}
          adminCashbacksTotalPages={adminCashbacksTotalPages}
          searchUserId={searchUserId}
          setSearchUserId={setSearchUserId}
          fetchAdminCashbacks={fetchAdminCashbacks}
        />
      )}
    </div>
  );
}
