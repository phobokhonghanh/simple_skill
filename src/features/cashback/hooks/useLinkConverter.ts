'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  SUPPORTED_DOMAINS,
  TOAST_ORANGE_PRESET,
  getFormattedSubId,
} from '@/features/cashback/config';
import { generateCashbackLink } from '@/features/cashback/api';
import type { Product, HistoryItem, User } from '@/features/cashback/types';
import { formatImageUrl, safeLocalStorage } from '@/features/cashback/utils';
import { useToast } from '@/components/providers/ToastProvider';

/**
 * Custom hook quản lý logic Chuyển đổi Link sản phẩm (Shopee, Lazada...) thành Link Hoàn tiền (Affiliate Link).
 * Quản lý validate URL, lưu lịch sử tìm kiếm vào localStorage, copy link và thông báo kết quả.
 *
 * @param user - Thông tin người dùng hiện tại (null nếu chưa đăng nhập).
 * @returns Đối tượng chứa các state link, product, history và các handler thao tác.
 */
export function useLinkConverter(user: User | null) {
  const t = useTranslations('cashback');
  const tCommon = useTranslations('common');
  const { warning: showWarningToast, custom: showCustomToast } = useToast();
  const [inputUrl, setInputUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [affiliateLink, setAffiliateLink] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);

  const [history, setHistory] = React.useState<HistoryItem[]>(() => {
    const storedHistory = safeLocalStorage.getItem('affiliate_history');
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) {
          return parsed as HistoryItem[];
        }
      } catch (e) {
        console.error('Không thể nạp lịch sử tạo link:', e);
      }
    }
    return [];
  });

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    safeLocalStorage.setItem('affiliate_history', JSON.stringify(newHistory));
  };

  const validateLink = React.useCallback(
    (url: string): boolean => {
      const trimmed = url.trim();
      if (!trimmed) {
        setValidationError(null);
        return false;
      }

      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        setValidationError(t('input.invalid_link'));
        return false;
      }

      const lowerUrl = trimmed.toLowerCase();
      const isValid = SUPPORTED_DOMAINS.some((domain) =>
        lowerUrl.includes(domain),
      );

      if (!isValid) {
        setValidationError(t('input.invalid_link'));
        return false;
      }

      setValidationError(null);
      return true;
    },
    [t],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputUrl(val);
    if (val) {
      validateLink(val);
    } else {
      setValidationError(null);
    }
  };

  const handleConversionError = React.useCallback(() => {
    setApiError(tCommon('errors.not_found'));
    showWarningToast(tCommon('errors.unknown'));
  }, [tCommon, showWarningToast]);

  const handleGenerate = React.useCallback(
    async (urlToFetch: string) => {
      if (!validateLink(urlToFetch)) return;

      setLoading(true);
      setApiError(null);
      setProduct(null);
      setAffiliateLink(null);
      setCopied(false);

      const subIds = getFormattedSubId(user?.id);

      try {
        const resData = await generateCashbackLink({
          link: urlToFetch,
          subIds: subIds,
        });

        if (resData && resData.ok && resData.data) {
          const affLink = resData.data.affiliate_link;
          const productData = resData.data.product;

          setAffiliateLink(affLink);

          if (productData) {
            productData.image = formatImageUrl(productData.image, 'shopee');
            setProduct(productData);
            setCurrentUrl(urlToFetch);
            setInputUrl('');

            const newItem: HistoryItem = {
              url: urlToFetch.trim(),
              affiliateLink: affLink,
              timestamp: Date.now(),
              product: productData,
            };

            const updatedHistory = [
              newItem,
              ...history.filter((item) => {
                if (productData.id && item?.product?.id === productData.id) {
                  return false;
                }
                return item.url !== urlToFetch.trim();
              }),
            ].slice(0, 5);

            saveHistory(updatedHistory);
          } else {
            handleConversionError();
          }
        } else {
          handleConversionError();
        }
      } catch (err) {
        console.error(err);
        handleConversionError();
      } finally {
        setLoading(false);
      }
    },
    [user?.id, history, validateLink, handleConversionError],
  );

  const handleSubmit = (targetUrlOrEvent?: string | React.FormEvent) => {
    if (typeof targetUrlOrEvent === 'string') {
      void handleGenerate(targetUrlOrEvent);
    } else if (targetUrlOrEvent && 'preventDefault' in targetUrlOrEvent) {
      targetUrlOrEvent.preventDefault();
      void handleGenerate(inputUrl);
    } else {
      void handleGenerate(inputUrl);
    }
  };

  const handleCopy = async () => {
    if (!affiliateLink) return;
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showCustomToast(tCommon('messages.copied_success'), TOAST_ORANGE_PRESET);
    } catch (e) {
      console.error('Sao chép thất bại:', e);
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setInputUrl('');
    setValidationError(null);
    setApiError(null);
    setProduct(item.product);
    setAffiliateLink(item.affiliateLink);
    setCurrentUrl(item.url);
  };

  const handleClearInput = () => {
    setInputUrl('');
    setValidationError(null);
  };

  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
        validateLink(text);
      }
    } catch (e) {
      console.warn('Không thể đọc dữ liệu clipboard:', e);
    }
  };

  return {
    inputUrl,
    loading,
    validationError,
    apiError,
    product,
    affiliateLink,
    copied,
    history,
    currentUrl,
    setHistory,
    handleInputChange,
    handleSubmit,
    handleCopy,
    handleClearHistory,
    handleSelectHistory,
    handleClearInput,
    handlePasteInput,
  };
}
