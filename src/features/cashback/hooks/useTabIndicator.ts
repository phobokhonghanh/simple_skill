'use client';

import * as React from 'react';

/**
 * Custom hook tính toán vị trí động và chiều rộng của vạch chỉ báo Tab active (Active Tab Indicator).
 * Tự động lắng nghe sự kiện thay đổi kích thước cửa sổ (resize) để tính lại offsetLeft và offsetWidth.
 *
 * @param activeTab - Tab ID đang chọn.
 * @param dependencies - Danh sách các dependency bổ sung khi cần tính lại vị trí.
 * @returns Đối tượng chứa ref lưu các nút tab (tabsRef) và style vị trí indicatorStyle ({ left, width }).
 */
export function useTabIndicator<T extends string>(
  activeTab: T,
  dependencies: unknown[] = [],
) {
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });
  const tabsRef = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const updateIndicator = React.useCallback(() => {
    const activeEl = tabsRef.current[activeTab];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab]);

  React.useEffect(() => {
    updateIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateIndicator, ...dependencies]);

  React.useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  React.useEffect(() => {
    const activeEl = tabsRef.current[activeTab];
    if (activeEl && activeEl.parentElement) {
      const container = activeEl.parentElement;
      const containerWidth = container.clientWidth;
      const elLeft = activeEl.offsetLeft;
      const elWidth = activeEl.offsetWidth;
      const targetScrollLeft = elLeft - containerWidth / 2 + elWidth / 2;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  return { tabsRef, indicatorStyle };
}
