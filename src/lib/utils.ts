import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Hợp nhất các tên lớp CSS (class names) bằng cách kết hợp clsx và tailwind-merge.
 * Giúp gộp điều kiện class và giải quyết xung đột Tailwind CSS class một cách tối ưu.
 *
 * @param inputs - Danh sách các tên lớp, mảng lớp hoặc đối tượng điều kiện class.
 * @returns Chuỗi tên lớp CSS đã được hợp nhất hoàn chỉnh.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

