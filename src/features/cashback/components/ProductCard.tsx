'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  Ticket,
  Copy,
  Check,
  Star,
  ChevronRight,
  Info,
  Clock,
  Store,
  Sparkles,
} from 'lucide-react';
import type { Product } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatImageUrl,
} from '@/features/cashback/utils';
import { Loading } from './Loading';

export interface ProductCardProps {
  product?: Product | null;
  affiliateLink?: string | null;
  loading?: boolean;
  copied?: boolean;
  variant?: 'detailed' | 'compact';
  platform?: string;
  onCopy?: () => void;
  onClick?: () => void;
  className?: string;
}

interface ProductImageProps {
  src?: string;
  alt?: string;
  isCompact?: boolean;
}

/**
 * Internal helper component để render ảnh sản phẩm kèm fallback Sparkles icon.
 */
function ProductImage({ src, alt = '', isCompact = false }: ProductImageProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={`${
        isCompact
          ? 'w-12 h-12 rounded-md'
          : 'w-28 sm:w-44 min-h-[140px] sm:min-h-[160px] rounded-md'
      } bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800 overflow-hidden flex items-center justify-center flex-shrink-0 relative shadow-2xs self-stretch`}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          width={isCompact ? 48 : 176}
          height={isCompact ? 48 : 176}
          className={`w-full h-full object-contain ${isCompact ? 'p-0.5' : 'p-1.5'}`}
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <Sparkles
          className={`${isCompact ? 'w-5 h-5' : 'w-7 h-7'} text-orange-500`}
        />
      )}
    </div>
  );
}

export function ProductCard({
  product,
  affiliateLink,
  loading = false,
  copied = false,
  variant = 'detailed',
  platform = 'shopee',
  onCopy,
  onClick,
  className = '',
}: ProductCardProps) {
  const t = useTranslations('cashback');
  const tCommon = useTranslations('common');

  if (loading) {
    return <Loading variant={variant} className={className} />;
  }

  if (!product) return null;

  // Gom các phép tính toán & định dạng dữ liệu dùng chung
  const imgUrl = formatImageUrl(product.image, platform);
  const formattedPrice = formatCurrency(product.price);
  const formattedCommission = formatCurrency(product.commission);

  // 1. Biến thể Thu nhỏ (Compact Variant) - Dùng cho Lịch sử tìm kiếm
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-6 cursor-pointer select-none hover:bg-gray-50/80 dark:hover:bg-neutral-800/50 transition-colors ${className}`}
      >
        {/* Ảnh và Tên sản phẩm */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <ProductImage src={imgUrl} alt={product.name} isCompact />
          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-neutral-200 line-clamp-2 leading-snug text-left pr-2">
            {product.name || ''}
          </h4>
        </div>

        {/* Giá (màu đen) và Tiền hoàn (màu cam) nằm trên 2 cột riêng biệt nằm ngang */}
        <div className="flex items-center gap-3 sm:gap-8 shrink-0">
          <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-neutral-200 whitespace-nowrap min-w-[65px] sm:min-w-[85px] text-right">
            {formattedPrice}
          </span>
          <span className="text-xs sm:text-sm font-bold text-orange-500 dark:text-orange-400 whitespace-nowrap min-w-[65px] sm:min-w-[85px] text-right">
            +{formattedCommission}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-neutral-500 shrink-0" />
        </div>
      </div>
    );
  }

  // 2. Biến thể Chi tiết (Detailed Variant) - Dùng cho Kết quả chuyển đổi chính
  return (
    <div
      className={`bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 rounded-md p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in duration-300 ${className}`}
    >
      {/* Khối chính: Ảnh bên trái, Toàn bộ thông tin bên phải (Căn giữa chiều dọc) */}
      <div className="flex flex-row gap-3.5 sm:gap-6 items-center">
        <ProductImage src={imgUrl} alt={product.name} />

        <div className="flex-1 min-w-0 text-left space-y-2.5 sm:space-y-3">
          {/* Tên sản phẩm */}
          <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2 sm:line-clamp-3">
            {product.name}
          </h2>

          {/* Metadata: Shop -> Sao -> Đã bán (Trên mobile Shop ở dòng 1, Sao & Đã bán ở dòng 2) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-neutral-400 font-medium">
            {product.shop && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 w-auto shrink-0">
                <Store className="w-3 h-3 text-gray-500 dark:text-neutral-400" />
                <span className="truncate max-w-[130px] sm:max-w-none">Shop: {product.shop}</span>
              </span>
            )}

            <div className="flex items-center gap-1.5 shrink-0">
              {product.shop && (product.rating !== undefined || product.sales) && (
                <span className="hidden sm:inline shrink-0 text-gray-400">•</span>
              )}

              {product.rating !== undefined && product.rating !== null && (
                <span className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{formatNumber(product.rating)}</span>
                </span>
              )}

              {product.rating !== undefined && product.rating !== null && product.sales && (
                <span className="shrink-0 text-gray-400">•</span>
              )}

              {product.sales && (
                <span className="shrink-0 whitespace-nowrap">{t('labels.sales_count', { count: product.sales })}</span>
              )}
            </div>
          </div>

          {/* Giá, Ước tính hoàn tiền & Thời gian cập nhật */}
          <div className="flex flex-wrap items-end justify-between gap-3 pt-1 sm:pt-1.5">
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="border-r border-gray-200 dark:border-neutral-800 pr-4 sm:pr-8 text-left">
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-neutral-400 font-medium block">
                  {t('labels.price')}
                </span>
                <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-neutral-100 mt-0.5">
                  {formattedPrice}
                </p>
              </div>
              <div className="text-left">
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-neutral-400 font-medium block">
                  {t('labels.commission_rate')}
                </span>
                <p className="text-sm sm:text-base font-bold text-orange-500 dark:text-orange-400 mt-0.5">
                  {formattedCommission}
                </p>
              </div>
            </div>

            {/* Thời gian cập nhật ở trên nút bấm, thuộc cùng khối thông tin sản phẩm */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-400 dark:text-neutral-500 font-medium shrink-0 ml-auto">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{t('labels.updated_at', { date: formatDate(product.lastUpdate || Date.now()) })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút thao tác & Banner thông báo */}
      {affiliateLink && (
        <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 space-y-3">
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3 w-full">
            <a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 sm:h-11 px-3 sm:px-5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer select-none border-0"
            >
              <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t('buttons.buy')}</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </a>

            <Button
              onClick={onCopy}
              type="button"
              variant="outline"
              className="h-9 sm:h-11 px-3 sm:px-4 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs border-solid"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">{tCommon('buttons.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-neutral-400" />
                  <span>{t('buttons.copy_link')}</span>
                </>
              )}
            </Button>
          </div>

          {/* Banner thông báo Voucher */}
          <div className="p-2.5 sm:p-3 rounded-md bg-orange-50/80 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 text-[11px] sm:text-xs text-gray-700 dark:text-neutral-300 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-left">
              {t('voucher.notice_prefix')}
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {t('voucher.notice_highlight')}
              </span>
              {t('voucher.notice_suffix')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

