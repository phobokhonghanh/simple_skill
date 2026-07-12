'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { generateCashbackLink } from '@/features/cashback/api';
import type { Product, HistoryItem, User } from '@/features/cashback/types';
import { formatShopeeImageUrl } from '@/features/cashback/utils';

export function useLinkConverter(user: User | null) {
  const t = useTranslations('cashback');
  const [inputUrl, setInputUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [productInfo, setProductInfo] = React.useState<Product | null>(null);
  const [affiliateLink, setAffiliateLink] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);

  const [history, setHistory] = React.useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedHistory = localStorage.getItem('affiliate_history');
      try {
        if (storedHistory) {
          const parsed = JSON.parse(storedHistory);
          if (Array.isArray(parsed)) {
            return parsed as HistoryItem[];
          }
        }
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
    return [];
  });

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('affiliate_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const validateLink = (url: string): boolean => {
    if (!url.trim()) {
      setValidationError(null);
      return false;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setValidationError(t('invalid_link'));
      return false;
    }

    try {
      const hostname = new URL(url).hostname;
      const isValid =
        hostname.includes('shopee.vn') ||
        hostname.includes('shp.ee') ||
        hostname.includes('shopee.co.id') ||
        hostname.includes('shopee.sg') ||
        hostname.includes('shopee.tw');

      if (!isValid) {
        setValidationError(t('invalid_link'));
        return false;
      }

      setValidationError(null);
      return true;
    } catch {
      const isValid = url.includes('shopee.vn') || url.includes('shp.ee');
      if (!isValid) {
        setValidationError(t('invalid_link'));
        return false;
      }
      setValidationError(null);
      return true;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputUrl(val);
    if (val) {
      validateLink(val);
    } else {
      setValidationError(null);
    }
  };

  const handleGenerate = async (urlToFetch: string) => {
    if (!validateLink(urlToFetch)) return;

    setLoading(true);
    setApiError(null);
    setProductInfo(null);
    setAffiliateLink(null);
    setCopied(false);

    const subIds = user ? [`ndinhnguyen-${user.id}`] : ['ndinhnguyen'];

    try {
      const resData = await generateCashbackLink({
        link: urlToFetch,
        subIds: subIds,
      });

      if (resData && resData.ok && resData.data) {
        const affLink = resData.data.affiliate_link;
        const product = resData.data.product;

        setAffiliateLink(affLink);

        if (product) {
          const formattedImageUrl = formatShopeeImageUrl(product.image);
          const updatedProduct: Product = {
            ...product,
            image: formattedImageUrl,
          };

          setProductInfo(updatedProduct);
          setCurrentUrl(urlToFetch);
          setInputUrl('');

          const newItem: HistoryItem = {
            url: urlToFetch.trim(),
            affiliateLink: affLink,
            timestamp: Date.now(),
            product: {
              itemId: product.itemId || null,
              name: product.name,
              image: formattedImageUrl,
              price: product.price,
              commission: product.commission || 0,
              rating: product.rating,
              sales: product.sales,
              shop: product.shop,
              lastUpdate: product.lastUpdate || null,
            },
          };

          const updatedHistory = [
            newItem,
            ...history.filter((item) => {
              if (product.itemId && item?.product?.itemId === product.itemId) {
                return false;
              }
              return item.url !== urlToFetch.trim();
            }),
          ].slice(0, 5);

          saveHistory(updatedHistory);
        } else {
          setApiError(t('not_found'));
        }
      } else {
        setApiError(t('not_found'));
      }
    } catch (err) {
      console.error(err);
      setApiError(t('not_found'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(inputUrl);
  };

  const handleCopy = async () => {
    if (!affiliateLink) return;
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setInputUrl('');
    setValidationError(null);
    setApiError(null);
    setProductInfo(item.product);
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
      console.warn('Failed to read clipboard', e);
    }
  };

  return {
    inputUrl,
    loading,
    validationError,
    apiError,
    productInfo,
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
