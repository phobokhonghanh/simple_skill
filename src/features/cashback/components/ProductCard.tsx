'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ExternalLink, Star, Copy, Check, Sparkles } from 'lucide-react';
import type { Product } from '@/features/cashback/types';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatImageUrl,
  getPlatformStyle,
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
      className={`${isCompact ? 'w-12 h-12 rounded-lg' : 'w-full sm:w-32 h-32 rounded-xl'
        } bg-white border border-[var(--aff-border)] overflow-hidden flex items-center justify-center flex-shrink-0 relative`}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          width={isCompact ? 48 : 128}
          height={isCompact ? 48 : 128}
          className={`w-full h-full object-contain ${isCompact ? 'p-0.5' : 'p-1'}`}
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <Sparkles
          className={`${isCompact ? 'w-5 h-5' : 'w-8 h-8'} text-[var(--aff-orange)]`}
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
  const { border: platformBorderClass } = getPlatformStyle(platform);

  // 1. Biến thể Thu nhỏ (Compact Variant) - Dùng cho Lịch sử (Phân biệt Border theo Platform)
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`aff-history-item p-3 rounded-xl border flex gap-3 cursor-pointer select-none ${platformBorderClass || 'border-[var(--aff-border)]'
          } ${className}`}
      >
        <ProductImage src={imgUrl} alt={product.name} isCompact />

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-[var(--aff-heading)] truncate leading-normal text-left">
            {product.name || ''}
          </h4>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs font-semibold text-[var(--aff-text)]">
              {formattedPrice}
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded-full">
              {formattedCommission}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Biến thể Chi tiết (Detailed Variant) - Dùng cho Kết quả chuyển đổi chính
  return (
    <div
      className={`aff-card p-5 sm:p-6 rounded-2xl space-y-5 animate-in fade-in duration-300 ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <ProductImage src={imgUrl} alt={product.name} />

        <div className="flex-1 min-w-0 text-left space-y-2">
          <h2 className="font-extrabold text-sm sm:text-base text-[var(--aff-heading)] leading-snug line-clamp-2">
            {product.name}
          </h2>

          <div className="flex flex-wrap gap-2 pt-1 text-3xs font-semibold">
            {product.shop && (
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[var(--aff-muted)]">
                Shop: {product.shop}
              </span>
            )}
            {product.rating !== undefined && product.rating !== null && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                {formatNumber(product.rating)}
              </span>
            )}
            {product.sales && (
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[var(--aff-muted)]">
                {t('labels.sales_count', { count: product.sales })}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[var(--aff-border)]">
            <div>
              <span className="text-3xs tracking-wider text-[var(--aff-muted)] font-bold">
                {t('labels.price')}
              </span>
              <p className="text-sm sm:text-base font-extrabold text-[var(--aff-text)] mt-0.5">
                {formattedPrice}
              </p>
            </div>
            <div>
              <span className="text-3xs tracking-wider text-[var(--aff-muted)] font-bold">
                {t('labels.commission_rate')}
              </span>
              <p className="text-sm sm:text-base font-black text-amber-500 dark:text-amber-400 mt-0.5">
                {formattedCommission}
              </p>
            </div>
          </div>

          {product.lastUpdate && (
            <p className="text-4xs text-[var(--aff-muted)] pt-1 text-right">
              {t('labels.updated_at', { date: formatDate(product.lastUpdate) })}
            </p>
          )}
        </div>
      </div>

      {affiliateLink && (
        <div className="space-y-3 pt-4 border-t border-[var(--aff-border)]">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="aff-btn-primary py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-sm sm:text-base select-none cursor-pointer flex-[2]"
            >
              <span>{t('buttons.buy')}</span>
              <ExternalLink className="w-4.5 h-4.5" />
            </a>
            <Button
              onClick={onCopy}
              className="aff-btn-secondary py-3 px-5 rounded-xl flex items-center justify-center gap-2 flex-1 font-bold text-sm sm:text-base select-none cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4.5 h-4.5 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    {tCommon('buttons.copied')}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4.5 h-4.5" />
                  <span>{tCommon('buttons.copy')}</span>
                </>
              )}
            </Button>
          </div>

          <div className="text-left px-1">
            <p className="text-[11px] sm:text-xs text-red-500 font-medium italic leading-relaxed">
              {t('voucher.notice_prefix')}
              <span className="font-bold text-[var(--aff-orange)]">
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
