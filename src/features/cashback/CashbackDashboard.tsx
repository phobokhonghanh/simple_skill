'use client';

import * as React from 'react';

import { useCashbackAuth, useLinkConverter, useAdminPortal } from '@/features/cashback/hooks';

import { Header } from './components/layout/Header';
import { ConverterTab } from './components/tabs/Converter';
import { OrdersTab } from './components/tabs/Orders';
import { PaymentTab } from './components/tabs/Payment';
import { AdminTab } from './components/tabs/Admin';
import { NavBar } from '@/features/cashback/NavBar';
import type { CashbackTab } from '@/features/cashback/types';

import '@/features/cashback/cashback.css';

/**
 * Component chính quản lý giao diện và trạng thái của Trang hoàn tiền.
 * Điều phối các dữ liệu xác thực, chuyển đổi link, đơn hàng cá nhân và quản trị viên.
 */
export function CashbackDashboard() {
  const [activeTab, setActiveTab] = React.useState<CashbackTab>('converter');

  const auth = useCashbackAuth(
    React.useCallback(() => {
      setActiveTab('converter');
    }, []),
  );

  const admin = useAdminPortal(auth.token, auth.user?.role, activeTab);
  const converter = useLinkConverter(auth.user);

  /**
   * Đăng xuất người dùng khỏi hệ thống và xóa toàn bộ dữ liệu tạm thời
   * của phân hệ quản trị viên.
   */
  const handleLogout = React.useCallback(async () => {
    React.startTransition(() => {
      setActiveTab('converter');
      admin.setAdminConversions([]);
      admin.setAdminCashbacks([]);
    });
    await auth.handleLogout();
  }, [auth, admin]);

  return (
    <div className="affiliate-page-container relative overflow-x-hidden transition-colors duration-300 min-h-screen">
      {/* Sticky NavBar specific to cashback layout */}
      <NavBar
        user={auth.user}
        handleLogout={handleLogout}
        onLoginClick={auth.initiateGoogleLogin}
      />
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Block & Profile & Tab Select */}
        <Header
          user={auth.user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab 1: Converter Form & Recent Search Logs */}
        {activeTab === 'converter' && (
          <ConverterTab
            inputUrl={converter.inputUrl}
            loading={converter.loading || auth.loading}
            product={converter.product}
            affiliateLink={converter.affiliateLink}
            copied={converter.copied}
            history={converter.history}
            handleSubmit={converter.handleSubmit}
            handleCopy={converter.handleCopy}
            handleClearHistory={converter.handleClearHistory}
            handleSelectHistory={converter.handleSelectHistory}
          />
        )}

        {/* Tab 2: User Personal Orders (Self-Contained 0 Prop-Drilling) */}
        {activeTab === 'orders' && auth.user && (
          <OrdersTab token={auth.token} />
        )}

        {/* Tab 3: Withdrawal / Payments */}
        {activeTab === 'payment' && auth.user && <PaymentTab />}

        {/* Tab 4: Admin Portal */}
        {activeTab === 'admin' && auth.user && auth.user.role === 'admin' && (
          <AdminTab token={auth.token} adminState={admin} />
        )}
      </div>
    </div>
  );
}
