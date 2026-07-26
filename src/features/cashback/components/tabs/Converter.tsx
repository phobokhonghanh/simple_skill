'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { History, Trash2 } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Cột trái: Thanh tìm kiếm & Thông tin sản phẩm sau khi chuyển đổi */}
      <div className="lg:col-span-2 space-y-6">
        <ClientWrapper>
          <SearchBar
            key={inputUrl}
            onSearch={onSearchSubmit}
            loading={loading}
            initialValue={inputUrl}
          />
        </ClientWrapper>

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
      </div>

      {/* Cột phải: Lịch sử các đường link đã chuyển đổi gần đây */}
      <div className="lg:col-span-1">
        <ClientWrapper>
          <div className="aff-card p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--aff-heading)]">
                <History className="w-4.5 h-4.5 text-[var(--aff-orange)]" />
                <h3 className="font-bold text-sm sm:text-base">
                  {t('history.title')}
                </h3>
              </div>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleClearHistory}
                  className="h-auto p-0 text-red-500 hover:text-red-600 hover:bg-transparent text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('history.clear')}</span>
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-xs sm:text-sm text-[var(--aff-muted)] border border-dashed border-[var(--aff-border)] rounded-xl">
                {t('history.empty')}
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto p-1">
                {history.map((item, index) => (
                  <ProductCard
                    key={item.url + index}
                    product={item.product}
                    variant="compact"
                    onClick={() => onSelectHistoryItem(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </ClientWrapper>
      </div>
    </div>
  );
}
