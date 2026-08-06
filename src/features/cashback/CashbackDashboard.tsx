'use client';

import * as React from 'react';

import { useCashbackAuth } from '@/features/cashback/hooks';

import { CashbackPageLayout } from './components/layout/CashbackPageLayout';
import { Header } from './components/layout/Header';
import { ConverterTab } from './components/tabs/Converter';
import { OrdersTab } from './components/tabs/Orders';
import { PaymentTab } from './components/tabs/Payment';
import { AdminTab } from './components/tabs/Admin';
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

  /**
   * Đăng xuất người dùng khỏi hệ thống.
   */
  const handleLogout = React.useCallback(async () => {
    React.startTransition(() => {
      setActiveTab('converter');
    });
    await auth.handleLogout();
  }, [auth]);

  return (
    <CashbackPageLayout
      user={auth.user}
      handleLogout={handleLogout}
      onLoginClick={auth.initiateGoogleLogin}
    >
      {/* Header Block & Thẻ cá nhân & Thanh chọn Tab */}
      <Header
        user={auth.user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab 1: Converter Form & Lịch sử chuyển đổi link (Tự đóng gói 0 Props) */}
      {activeTab === 'converter' && <ConverterTab />}

      {/* Tab 2: Danh sách đơn hàng cá nhân (Tự đóng gói 0 Prop-Drilling) */}
      {activeTab === 'orders' && auth.user && (
        <OrdersTab token={auth.token} />
      )}

      {/* Tab 3: Rút tiền / Thanh toán */}
      {activeTab === 'payment' && auth.user && <PaymentTab />}

      {/* Tab 4: Bảng điều khiển Quản trị viên (Tự đóng gói 0 Props) */}
      {activeTab === 'admin' && auth.user && auth.user.role === 'admin' && (
        <AdminTab />
      )}
    </CashbackPageLayout>
  );
}
