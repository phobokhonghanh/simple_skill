/** Danh sách các bộ màu cài đặt sẵn (Preset) cho Danh mục */
export const CATEGORY_COLOR_PRESETS = [
  {
    id: 'blue',
    labelKey: 'colors.blue',
    foreground: '#2563eb',
    background: 'rgba(37, 99, 235, 0.12)',
    border: 'rgba(37, 99, 235, 0.32)',
  },
  {
    id: 'emerald',
    labelKey: 'colors.emerald',
    foreground: '#059669',
    background: 'rgba(5, 150, 105, 0.12)',
    border: 'rgba(5, 150, 105, 0.32)',
  },
  {
    id: 'amber',
    labelKey: 'colors.amber',
    foreground: '#d97706',
    background: 'rgba(217, 119, 6, 0.14)',
    border: 'rgba(217, 119, 6, 0.34)',
  },
  {
    id: 'rose',
    labelKey: 'colors.rose',
    foreground: '#e11d48',
    background: 'rgba(225, 29, 72, 0.12)',
    border: 'rgba(225, 29, 72, 0.32)',
  },
  {
    id: 'violet',
    labelKey: 'colors.violet',
    foreground: '#7c3aed',
    background: 'rgba(124, 58, 237, 0.12)',
    border: 'rgba(124, 58, 237, 0.32)',
  },
  {
    id: 'cyan',
    labelKey: 'colors.cyan',
    foreground: '#0891b2',
    background: 'rgba(8, 145, 178, 0.12)',
    border: 'rgba(8, 145, 178, 0.32)',
  },
] as const;

/** Kiểu dữ liệu ID của màu danh mục */
export type CategoryColorId = (typeof CATEGORY_COLOR_PRESETS)[number]['id'];

/** Màu mặc định của danh mục */
export const DEFAULT_CATEGORY_COLOR: CategoryColorId = 'blue';

/**
 * Kiểm tra một chuỗi bất kỳ có phải là ID màu danh mục hợp lệ hay không.
 *
 * @param value - Chuỗi cần kiểm tra.
 * @returns True nếu chuỗi thuộc danh sách CategoryColorId.
 */
export const isCategoryColorId = (value: string): value is CategoryColorId =>
  CATEGORY_COLOR_PRESETS.some((preset) => preset.id === value);

/**
 * Chuẩn hóa giá trị màu danh mục, trả về màu mặc định nếu giá trị đầu vào không hợp lệ.
 *
 * @param value - Giá trị màu cần chuẩn hóa.
 * @returns CategoryColorId hợp lệ.
 */
export const normalizeCategoryColor = (value: string): CategoryColorId =>
  isCategoryColorId(value) ? value : DEFAULT_CATEGORY_COLOR;

/**
 * Lấy đối tượng cấu hình màu (CategoryColorPreset) tương ứng với ID màu.
 *
 * @param color - ID của màu.
 * @returns Cấu hình preset màu tương ứng hoặc màu đầu tiên trong danh sách.
 */
export const getCategoryColorPreset = (color: string) =>
  CATEGORY_COLOR_PRESETS.find((preset) => preset.id === color) ??
  CATEGORY_COLOR_PRESETS[0];
