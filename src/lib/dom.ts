/**
 * Tùy chọn cấu hình khi cuộn trang tới một phần tử HTML.
 */
export interface ScrollToElementOptions {
  /** Thời gian trì hoãn (milisec) trước khi thực hiện cuộn (mặc định: 50ms) */
  delay?: number;
  /** Kiểu hiệu ứng cuộn ('smooth' hoặc 'auto') */
  behavior?: ScrollBehavior;
  /** Vị trí căn chỉnh phần tử ('start', 'center', 'end', 'nearest') */
  block?: ScrollLogicalPosition;
}

/**
 * Cuộn màn hình một cách mượt mà tới phần tử HTML được xác định bởi ID.
 *
 * @param elementId - ID của phần tử HTML mục tiêu.
 * @param options - Tùy chọn thời gian trì hoãn, hiệu ứng cuộn và vị trí căn chỉnh.
 */
export const scrollToElement = (
  elementId: string,
  options: ScrollToElementOptions = {},
): void => {
  const { delay = 50, behavior = 'smooth', block = 'start' } = options;

  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior, block });
      }
    }, delay);
  }
};
