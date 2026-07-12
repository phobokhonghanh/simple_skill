'use client';

import * as React from 'react';

import { useCashbackAuth } from '@/features/cashback/hooks/useCashbackAuth';
import { useCoinAnimation } from '@/features/cashback/hooks/useCoinAnimation';
import { useLinkConverter } from '@/features/cashback/hooks/useLinkConverter';
import { useUserHistory } from '@/features/cashback/hooks/useUserHistory';
import { useAdminPortal } from '@/features/cashback/hooks/useAdminPortal';

import { DashboardHeader } from '@/features/cashback/DashboardHeader';
import { ConverterTab } from '@/features/cashback/ConverterTab';
import { HistoryTab } from '@/features/cashback/HistoryTab';
import { PaymentTab } from '@/features/cashback/PaymentTab';
import { AdminTab } from '@/features/cashback/AdminTab';
import { NavBar } from '@/features/cashback/NavBar';

import Coin from '@/features/cashback/Coin';
import '@/features/cashback/cashback.css';

interface CustomWindow extends Window {
  google?: {
    accounts?: {
      id?: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential?: string }) => void;
          auto_select?: boolean;
        }) => void;
        renderButton: (
          parent: HTMLElement,
          options: {
            type?: string;
            theme?: string;
            size?: string;
            text?: string;
            shape?: string;
            logo_alignment?: string;
            width?: string;
          }
        ) => void;
      };
    };
  };
  __gsiInitialized?: boolean;
}

export function CashbackDashboard() {
  const [activeTab, setActiveTab] = React.useState<'converter' | 'history' | 'payment' | 'admin'>('converter');

  // Business logic hooks
  const auth = useCashbackAuth(
    React.useCallback(() => {
      setActiveTab('converter');
    }, [])
  );

  const history = useUserHistory(auth.token, activeTab);
  const admin = useAdminPortal(auth.token, auth.user?.role, activeTab);
  const anim = useCoinAnimation(history.uiTotalCashback);
  const converter = useLinkConverter(auth.user);

  // Custom logout wrapper to clear sub-module states
  const handleLogout = React.useCallback(async () => {
    await auth.handleLogout();
    history.setCashbackHistory([]);
    admin.setAdminConversions([]);
    admin.setAdminCashbacks([]);
    setActiveTab('converter');
  }, [auth, history, admin]);

  // Reset page helper when clicking user history tab
  const resetUserHistoryPage = React.useCallback(() => {
    history.setUserHistoryPage(1);
  }, [history]);

  // Google Identity Services (GSI) Initialization
  React.useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (!googleClientId) {
      console.warn('Google Client ID is not configured.');
    }

    const initAndRenderGsi = () => {
      const w = window as unknown as CustomWindow;
      if (w.google?.accounts?.id) {
        if (!w.__gsiInitialized) {
          w.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response) => {
              if (response.credential) {
                await auth.handleGoogleLogin(response.credential);
              }
            },
            auto_select: false,
          });
          w.__gsiInitialized = true;
        }

        if (!auth.user) {
          const btnContainer = document.getElementById('gsi-btn-container');
          if (btnContainer) {
            btnContainer.innerHTML = ''; // Prevent duplicate buttons by clearing container first
            w.google.accounts.id.renderButton(btnContainer, {
              type: 'standard',
              theme: 'outline',
              size: 'medium',
              text: 'signin',
              shape: 'pill',
            });
          }
        }
      }
    };

    const w = window as unknown as CustomWindow;
    if (w.google?.accounts?.id) {
      initAndRenderGsi();
    } else {
      const interval = setInterval(() => {
        const w = window as unknown as CustomWindow;
        if (w.google?.accounts?.id) {
          clearInterval(interval);
          initAndRenderGsi();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [auth.user, auth]);


  return (
    <div className="affiliate-page-container relative overflow-x-hidden transition-colors duration-300 min-h-screen">
      {/* Sticky NavBar specific to cashback layout */}
      <NavBar user={auth.user} handleLogout={handleLogout} />

      {/* Background falling coins */}
      {anim.fallingCoins.map((coin) => (
        <div
          key={coin.id}
          className="falling-coin"
          style={{ left: `${coin.left}%` }}
        >
          <Coin size={coin.size} animate={true} />
        </div>
      ))}

      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Block & Profile & Tab Select */}
        <DashboardHeader
          user={auth.user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          resetUserHistoryPage={resetUserHistoryPage}
        />

        {/* Tab 1: Converter Form & Recent Search Logs */}
        {activeTab === 'converter' && (
          <ConverterTab
            inputUrl={converter.inputUrl}
            loading={converter.loading || auth.loading}
            validationError={converter.validationError}
            apiError={converter.apiError || auth.apiError}
            productInfo={converter.productInfo}
            affiliateLink={converter.affiliateLink}
            copied={converter.copied}
            history={converter.history}
            handleInputChange={converter.handleInputChange}
            handleSubmit={converter.handleSubmit}
            handleCopy={converter.handleCopy}
            handleClearHistory={converter.handleClearHistory}
            handleSelectHistory={converter.handleSelectHistory}
          />
        )}

        {/* Tab 2: User Personal History */}
        {activeTab === 'history' && auth.user && (
          <HistoryTab
            loadingHistory={history.loadingHistory}
            historyError={history.historyError}
            expandedRecordId={history.expandedRecordId}
            setExpandedRecordId={history.setExpandedRecordId}
            userHistoryPage={history.userHistoryPage}
            setUserHistoryPage={history.setUserHistoryPage}
            userHistoryTotal={history.userHistoryTotal}
            userHistoryTotalPages={history.userHistoryTotalPages}
            historyStart={history.historyStart}
            setHistoryStart={history.setHistoryStart}
            historyEnd={history.historyEnd}
            setHistoryEnd={history.setHistoryEnd}
            filterPlatform={history.filterPlatform}
            setFilterPlatform={history.setFilterPlatform}
            filterStatus={history.filterStatus}
            setFilterStatus={history.setFilterStatus}
            sortByTime={history.sortByTime}
            setSortByTime={history.setSortByTime}
            fetchUserHistory={history.fetchUserHistory}
            processedUserHistory={history.processedUserHistory}
            uiTotalCashback={history.uiTotalCashback}
            burstCoins={anim.burstCoins}
          />
        )}

        {/* Tab 3: Withdrawal / Payments */}
        {activeTab === 'payment' && auth.user && <PaymentTab />}

        {/* Tab 4: Admin Portal */}
        {activeTab === 'admin' && auth.user && auth.user.role === 'admin' && (
          <AdminTab
            token={auth.token}
            adminSubTab={admin.adminSubTab}
            setAdminSubTab={admin.setAdminSubTab}
            syncStart={admin.syncStart}
            setSyncStart={admin.setSyncStart}
            syncEnd={admin.syncEnd}
            setSyncEnd={admin.setSyncEnd}
            syncSubId={admin.syncSubId}
            setSyncSubId={admin.setSyncSubId}
            syncLoading={admin.syncLoading}
            syncMessage={admin.syncMessage}
            syncSuccess={admin.syncSuccess}
            setSyncMessage={admin.setSyncMessage}
            handleAdminSync={admin.handleAdminSync}
            adminConversions={admin.adminConversions}
            loadingAdminConversions={admin.loadingAdminConversions}
            adminError={admin.adminError}
            adminPage={admin.adminPage}
            setAdminPage={admin.setAdminPage}
            adminTotal={admin.adminTotal}
            adminTotalPages={admin.adminTotalPages}
            expandedAdminRecordId={admin.expandedAdminRecordId}
            setExpandedAdminRecordId={admin.setExpandedAdminRecordId}
            filterSubId={admin.filterSubId}
            setFilterSubId={admin.setFilterSubId}
            filterStart={admin.filterStart}
            setFilterStart={admin.setFilterStart}
            filterEnd={admin.filterEnd}
            setFilterEnd={admin.setFilterEnd}
            fetchAdminConversions={admin.fetchAdminConversions}
            adminCashbacks={admin.adminCashbacks}
            loadingAdminCashbacks={admin.loadingAdminCashbacks}
            adminCashbacksError={admin.adminCashbacksError}
            adminCashbacksPage={admin.adminCashbacksPage}
            setAdminCashbacksPage={admin.setAdminCashbacksPage}
            adminCashbacksTotal={admin.adminCashbacksTotal}
            adminCashbacksTotalPages={admin.adminCashbacksTotalPages}
            searchUserId={admin.searchUserId}
            setSearchUserId={admin.setSearchUserId}
            fetchAdminCashbacks={admin.fetchAdminCashbacks}
          />
        )}
      </div>
    </div>
  );
}
