/**
 * Định dạng timestamp (giây) hoặc chuỗi ngày ISO thành chuỗi ngày hiển thị dễ đọc (DD/MM/YYYY HH:mm).
 *
 * @param dateInput - Unix timestamp (tính bằng giây), timestamp milisec, hoặc chuỗi ngày ISO.
 * @param fallback - Chuỗi dự phòng trả về khi dateInput rỗng hoặc không hợp lệ (mặc định là '—').
 * @returns Chuỗi ngày tháng đã định dạng (ví dụ: "24/07/2026 09:30" hoặc "—").
 */
export const formatDate = (
  dateInput?: string | number | null,
  fallback = '—',
): string => {
  if (!dateInput) return fallback;
  let date: Date;
  if (typeof dateInput === 'number') {
    date = new Date(dateInput * 1000);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return fallback;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Định dạng chuỗi ngày dạng YYYY-MM-DD thành dạng DD/MM/YYYY.
 *
 * @param dateStr - Chuỗi ngày đầu vào định dạng YYYY-MM-DD.
 * @param separator - Ký tự phân cách hiển thị mong muốn (mặc định là '/').
 * @returns Chuỗi ngày đã định dạng (ví dụ: "24/07/2026").
 */
export const formatDateString = (dateStr: string, separator = '/'): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}${separator}${parts[1]}${separator}${parts[0]}`;
  }
  return dateStr;
};

/**
 * Chuyển đổi chuỗi ngày thành Unix timestamp tính bằng giây.
 *
 * @param dateStr - Chuỗi ngày cần chuyển đổi.
 * @param isEndOfDay - Nếu là true, thiết lập thời gian cuối ngày (23:59:59.999), ngược lại là đầu ngày (00:00:00.000).
 * @returns Unix timestamp dạng số nguyên (giây) hoặc undefined nếu chuỗi ngày không hợp lệ.
 */
export const dateToUnixSeconds = (
  dateStr: string,
  isEndOfDay = false,
): number | undefined => {
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

/**
 * Lấy chuỗi ngày hiện tại theo định dạng YYYY-MM-DD.
 *
 * @returns Chuỗi ngày hiện tại (ví dụ: "2026-07-26").
 */
export const getCurrentDateStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Lấy chuỗi ngày 30 ngày trước theo định dạng YYYY-MM-DD.
 *
 * @returns Chuỗi ngày 30 ngày trước.
 */
export const getThirtyDaysAgoStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
};

/**
 * Lấy chuỗi ngày đầu tiên của tháng hiện tại theo định dạng YYYY-MM-01.
 *
 * @returns Chuỗi ngày đầu tháng hiện tại.
 */
export const getStartOfCurrentMonthStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};
