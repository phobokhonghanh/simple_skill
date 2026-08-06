'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, Clock, ChevronDown } from 'lucide-react';
import type { HistoryItem } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';
import { ClientWrapper } from '@/components/ui/ClientWrapper';
import { scrollToElement } from '@/features/cashback/utils';
import { SearchBar } from '@/features/cashback/components/input/SearchBar';
import { ProductCard } from '@/features/cashback/components/ProductCard';
import { useLinkConverter } from '@/features/cashback/hooks';

/**
 * Component hiển thị giao diện chuyển đổi link sản phẩm Shopee sang link tiếp thị liên kết (affiliate).
 * Tự đóng gói logic nghiệp vụ với `useLinkConverter()` (0 Props).
 * Bao gồm thanh nhập link, hiển thị thông tin sản phẩm và lịch sử chuyển đổi cá nhân.
 */
export function ConverterTab() {
  const t = useTranslations('cashback');
  const [showAllHistory, setShowAllHistory] = React.useState(false);
  const {
    inputUrl,
    loading,
    product,
    affiliateLink,
    copied,
    history,
    handleSubmit,
    handleCopy,
    handleClearHistory,
    handleSelectHistory,
  } = useLinkConverter();

  const onSelectHistoryItem = (item: HistoryItem) => {
    handleSelectHistory(item);
    scrollToElement('converted-product-section');
  };

  const onSearchSubmit = (url: string) => {
    handleSubmit(url);
    scrollToElement('converted-product-section');
  };

  const visibleHistory = showAllHistory ? history : history.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Khối 1: Thanh Tìm Kiếm (Không có div khung bao quanh) */}
      <ClientWrapper>
        <SearchBar
          key={inputUrl}
          onSearch={onSearchSubmit}
          loading={loading}
          initialValue={inputUrl}
        />
      </ClientWrapper>

      {/* Khối 2: Kết quả Thông Tin Sản Phẩm (Hiển thị khi đang load hoặc đã tìm thấy SP) */}
      {(loading || product) && (
        <ClientWrapper>
          <section id="converted-product-section" className="scroll-mt-20">
            <ProductCard
              product={product}
              affiliateLink={affiliateLink}
              loading={loading}
              copied={copied}
              variant="detailed"
              onCopy={handleCopy}
            />
          </section>
        </ClientWrapper>
      )}

      {/* Khối 3: Lịch Sử Tìm Kiếm */}
      <ClientWrapper>
        <div className="bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 rounded-md p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-neutral-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-700 dark:text-neutral-300 stroke-[2.2]" />
              <span>{t('history.title')}</span>
            </h3>
            {history.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearHistory}
                className="h-auto p-0 text-red-500 hover:text-red-600 hover:bg-transparent text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer select-none"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('history.clear')}</span>
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-xs sm:text-sm text-gray-400 dark:text-neutral-500 border border-dashed border-gray-200 dark:border-neutral-800 rounded-md">
              {t('history.empty')}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Khung bọc duy nhất cho toàn bộ danh sách sản phẩm lịch sử */}
              <div className="border border-gray-200/80 dark:border-neutral-800 rounded-md overflow-hidden divide-y divide-gray-100 dark:divide-neutral-800/80 bg-white dark:bg-neutral-900">
                {visibleHistory.map((item, index) => (
                  <ProductCard
                    key={item.url + index}
                    product={item.product}
                    variant="compact"
                    onClick={() => onSelectHistoryItem(item)}
                  />
                ))}
              </div>

              {history.length > 3 && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors cursor-pointer select-none"
                  >
                    <span>
                      {showAllHistory ? t('history.show_less') : t('history.show_more')}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showAllHistory ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </ClientWrapper>
    </div>
  );
}

