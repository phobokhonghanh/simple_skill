/**
 * Shared utility functions for the Cashback feature.
 */

/**
 * Formats a numeric price into Vietnamese Dong format.
 */
export const formatPrice = (price?: number | null): string => {
  if (price === undefined || price === null) return '—';
  return price.toLocaleString('vi-VN') + ' ₫';
};

/**
 * Ensures Shopee image URL prefix.
 */
export const formatShopeeImageUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://cf.shopee.vn/file/${url}`;
};

/**
 * Formats timestamps (seconds) or ISO date strings into readable local dates.
 */
export const formatDate = (dateInput?: string | number | null): string => {
  if (!dateInput) return '—';
  let date: Date;
  if (typeof dateInput === 'number') {
    date = new Date(dateInput * 1000);
  } else {
    date = new Date(dateInput);
  }
  
  if (isNaN(date.getTime())) return '—';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Parses date string to unix timestamp in seconds.
 */
export const dateToUnixSeconds = (dateStr: string, isEndOfDay = false): number | undefined => {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return undefined;
  if (isEndOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return Math.floor(date.getTime() / 1000);
};
