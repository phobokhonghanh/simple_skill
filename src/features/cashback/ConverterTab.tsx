'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  Copy,
  ExternalLink,
  Star,
  Trash2,
  History,
  Sparkles,
  Check,
  Loader2,
  AlertTriangle,
  Clipboard,
  X
} from 'lucide-react';
import type { Product, HistoryItem } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';
import { formatShopeeImageUrl, formatPrice, formatDate } from '@/features/cashback/utils';

interface ConverterTabProps {
  inputUrl: string;
  loading: boolean;
  validationError: string | null;
  apiError: string | null;
  productInfo: Product | null;
  affiliateLink: string | null;
  copied: boolean;
  history: HistoryItem[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCopy: () => void;
  handleClearHistory: () => void;
  handleSelectHistory: (item: HistoryItem) => void;
  handleClearInput: () => void;
  handlePasteInput: () => void;
}


export function ConverterTab({
  inputUrl,
  loading,
  validationError,
  apiError,
  productInfo,
  affiliateLink,
  copied,
  history,
  handleInputChange,
  handleSubmit,
  handleCopy,
  handleClearHistory,
  handleSelectHistory,
  handleClearInput,
  handlePasteInput,
}: ConverterTabProps) {
  const t = useTranslations('cashback');

  const formatRating = (rating: unknown): string => {
    if (rating === undefined || rating === null) return '—';
    if (typeof rating === 'number') {
      return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
    }
    if (typeof rating === 'string') {
      const num = parseFloat(rating);
      if (!isNaN(num)) {
        return num % 1 === 0 ? num.toString() : num.toFixed(1);
      }
      return rating;
    }
    return '—';
  };
  const onSelectHistoryItem = (item: HistoryItem) => {
    handleSelectHistory(item);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const section = document.getElementById('converted-product-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const section = document.getElementById('converted-product-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column: Form & Main Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search Card */}
        <div className="aff-card p-5 sm:p-6 rounded-2xl">
          <form onSubmit={onFormSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  className={`aff-input w-full pl-4 pr-24 py-3 rounded-xl text-sm sm:text-base ${
                    validationError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                      : ''
                  }`}
                  placeholder={t('input_placeholder')}
                  value={inputUrl}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {inputUrl ? (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      disabled={loading}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer select-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePasteInput}
                      disabled={loading}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors text-xs font-semibold cursor-pointer select-none bg-gray-100/50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>{t('btn_paste')}</span>
                    </button>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="aff-btn-primary h-auto py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-sm sm:text-base cursor-pointer select-none disabled:opacity-50"
                disabled={loading || !!validationError || !inputUrl.trim()}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{t('btn_search')}</span>
              </Button>
            </div>
            {validationError && (
              <p className="text-red-500 text-xs font-semibold pl-1">
                {validationError}
              </p>
            )}
          </form>
        </div>

        {/* Api Error Alert */}
        {apiError && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-600 dark:text-red-400 flex gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">{t('error_title')}</h4>
              <p className="text-xs mt-1 leading-relaxed">{apiError}</p>
            </div>
          </div>
        )}

        {/* Converted Product View or Skeleton Loading */}
        <section id="converted-product-section" className="scroll-mt-20">
          {loading ? (
            <div className="aff-card p-5 sm:p-6 rounded-2xl space-y-5 animate-pulse">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Image Skeleton */}
                <div className="w-full sm:w-32 h-32 rounded-xl bg-neutral-200 dark:bg-neutral-800/60 flex-shrink-0" />
                
                {/* Text Skeleton */}
                <div className="flex-1 space-y-3 py-1 text-left">
                  <div className="h-4.5 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-1/2" />
                  
                  <div className="flex gap-2 pt-2">
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800/60 rounded-full w-20" />
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800/60 rounded-full w-16" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--aff-border)]">
                    <div className="space-y-1.5">
                      <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-10" />
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-24" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-10" />
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800/60 rounded-md w-24" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Button Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--aff-border)]">
                <div className="h-11 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl w-full" />
                <div className="h-11 bg-neutral-200 dark:bg-neutral-800/60 rounded-xl w-full" />
              </div>
            </div>
          ) : (
            productInfo && (
              <div className="aff-card p-5 sm:p-6 rounded-2xl space-y-5 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 rounded-xl bg-white border border-[var(--aff-border)] overflow-hidden flex items-center justify-center flex-shrink-0">
                    {productInfo.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formatShopeeImageUrl(productInfo.image)}
                        alt={productInfo.name}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                      />
                    ) : (
                      <Sparkles className="w-8 h-8 text-[var(--aff-orange)]" />
                    )}
                  </div>

                  {/* Product Text Details */}
                  <div className="flex-1 min-w-0 text-left space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-extrabold text-sm sm:text-base text-[var(--aff-heading)] leading-snug line-clamp-2">
                        {productInfo.name}
                      </h2>
                    </div>

                    {/* Info Pills */}
                    <div className="flex flex-wrap gap-2 pt-1 text-3xs font-semibold">
                      {productInfo.shop && (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[var(--aff-muted)]">
                          Shop: {productInfo.shop}
                        </span>
                      )}
                      {productInfo.rating !== undefined && productInfo.rating !== null && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          {formatRating(productInfo.rating)}
                        </span>
                      )}
                      {productInfo.sales && (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[var(--aff-muted)]">
                          {t('sales_count', { count: productInfo.sales })}
                        </span>
                      )}
                    </div>

                    {/* Price and Commission */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[var(--aff-border)]">
                      <div>
                        <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
                          {t('product_price')}
                        </span>
                        <p className="text-sm sm:text-base font-extrabold text-[var(--aff-text)] mt-0.5">
                          {formatPrice(productInfo.price)}
                        </p>
                      </div>
                      <div>
                        <span className="text-3xs uppercase tracking-wider text-[var(--aff-muted)] font-bold">
                          {t('commission_rate')}
                        </span>
                        <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {formatPrice(productInfo.commission)}
                        </p>
                      </div>
                    </div>

                    {productInfo.lastUpdate && (
                      <p className="text-4xs text-[var(--aff-muted)] pt-1 text-right">
                        {t('updated_at', { date: formatDate(productInfo.lastUpdate) })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Call To Actions */}
                {affiliateLink && (
                  <div className="space-y-3 pt-4 border-t border-[var(--aff-border)]">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aff-btn-primary py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-sm sm:text-base select-none cursor-pointer flex-[2]"
                      >
                        <span>{t('btn_buy')}</span>
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                      <Button
                        onClick={handleCopy}
                        className="aff-btn-secondary py-3 px-5 rounded-xl flex items-center justify-center gap-2 flex-1 font-bold text-sm sm:text-base select-none cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4.5 h-4.5 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">
                              {t('btn_copied')}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4.5 h-4.5" />
                            <span>{t('btn_copy')}</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Voucher Exclusive Offer Alert */}
                    <div className="text-left px-1">
                      <p className="text-[11px] sm:text-xs text-red-500 font-medium italic leading-relaxed">
                        {t('voucher_notice_prefix')}
                        <span className="font-bold text-[var(--aff-orange)]">{t('voucher_notice_highlight')}</span>
                        {t('voucher_notice_suffix')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </section>
      </div>

      {/* Right Column: Search History */}
      <div className="lg:col-span-1">
        <div className="aff-card p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--aff-heading)]">
              <History className="w-4.5 h-4.5 text-[var(--aff-orange)]" />
              <h3 className="font-bold text-sm sm:text-base">{t('history_title')}</h3>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearHistory}
                className="h-auto p-0 text-red-500 hover:text-red-600 hover:bg-transparent text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('history_clear')}</span>
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-xs sm:text-sm text-[var(--aff-muted)] border border-dashed border-[var(--aff-border)] rounded-xl">
              {t('history_empty')}
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto p-1">
              {history.map((item, index) => (
                <div
                  key={item.url + index}
                  onClick={() => onSelectHistoryItem(item)}
                  className="aff-history-item p-3 rounded-xl border border-[var(--aff-border)] flex gap-3 cursor-pointer select-none"
                >
                  {/* Image Thumbnail */}
                  <div className="w-12 h-12 rounded-lg border border-[var(--aff-border)] bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.product?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formatShopeeImageUrl(item.product.image)}
                        alt=""
                        className="w-full h-full object-contain p-0.5"
                        loading="lazy"
                      />
                    ) : (
                      <Sparkles className="w-5 h-5 text-[var(--aff-orange)]" />
                    )}
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[var(--aff-heading)] truncate leading-normal text-left">
                      {item.product?.name || ''}
                    </h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-500">
                        {item.product ? formatPrice(item.product.price) : '—'}
                      </span>
                      <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded-full">
                        {item.product?.commission ? formatPrice(item.product.commission) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
