import type { CategoryColorId } from '@/features/bookmarks/colors';

/** Interface mô tả thông tin Danh mục (Category) của Bookmark */
export interface Category {
  /** Định danh danh mục */
  id: string;
  /** Tên danh mục hiển thị */
  name: string;
  /** Slug URL của danh mục */
  slug: string;
  /** Mã màu nhận diện danh mục */
  color: CategoryColorId;
  /** ID danh mục cha (null nếu là danh mục gốc) */
  parentId: string | null;
  /** Thời gian tạo ISO string */
  createdAt: string;
}

/** Node cây danh mục phân cấp (Tree structure) */
export interface CategoryTreeNode extends Category {
  /** Danh sách các danh mục con */
  children: CategoryTreeNode[];
}

/** Interface mô tả thông tin một thẻ Bookmark */
export interface Bookmark {
  /** Định danh Bookmark */
  id: string;
  /** Tiêu đề Bookmark */
  title: string;
  /** Đường dẫn URL trang web */
  url: string;
  /** Mô tả chi tiết (tùy chọn) */
  description: string | null;
  /** ID danh mục trực thuộc */
  categoryId: string;
  /** Tên danh mục trực thuộc */
  categoryName: string;
  /** Slug danh mục trực thuộc */
  categorySlug: string;
  /** Màu sắc danh mục trực thuộc */
  categoryColor: CategoryColorId;
  /** Thời điểm tạo */
  createdAt: string;
  /** Thời điểm cập nhật cuối cùng */
  updatedAt: string;
}

/** Cấu trúc metadata phân trang cho Bookmark */
export interface PaginationMetadata {
  /** Tổng số bản ghi */
  total: number;
  /** Trang hiện tại */
  page: number;
  /** Kích thước trang */
  pageSize: number;
  /** Tổng số trang */
  totalPages: number;
}

/** Các bộ lọc điều kiện tìm kiếm Bookmark */
export interface BookmarkFilters {
  /** Từ khóa tìm kiếm */
  query?: string;
  /** ID danh mục chọn lọc */
  categoryId?: string;
  /** Số trang */
  page?: number;
  /** Kích thước số item mỗi trang */
  pageSize?: number;
  /** Trường sắp xếp */
  sortBy?: 'createdAt' | 'title' | 'url';
  /** Thứ tự sắp xếp tăng/giảm */
  sortOrder?: 'asc' | 'desc';
}

/** Mã phản hồi kết quả thao tác Bookmark */
export type BookmarkActionCode =
  | 'ok'
  | 'auth_invalid'
  | 'auth_missing_config'
  | 'category_required'
  | 'category_in_use'
  | 'category_has_children'
  | 'category_not_found'
  | 'bookmark_not_found'
  | 'title_required'
  | 'url_invalid'
  | 'db_unavailable'
  | 'unknown_error';

/** Kết quả trả về của các thao tác thêm/sửa/xóa Bookmark/Category */
export interface BookmarkActionResult {
  ok: boolean;
  code: BookmarkActionCode;
}

/** Kết quả nạp dữ liệu cho BookmarkDashboard */
export type BookmarkDashboardLoadResult =
  | {
      ok: true;
      code: 'ok';
      data: BookmarkDashboardData;
    }
  | {
      ok: false;
      code: Exclude<BookmarkActionCode, 'ok'>;
    };

/** Cấu trúc dữ liệu đầy đủ cho giao diện BookmarkDashboard */
export interface BookmarkDashboardData {
  bookmarks: Bookmark[];
  categories: Category[];
  categoryTree: CategoryTreeNode[];
  selectedCategoryIds: string[];
  dbReady: boolean;
  pagination: PaginationMetadata;
}

/** Interface nhãn ngôn ngữ i18n cho BookmarkDashboard */
export interface BookmarkDashboardLabels {
  subtitle: string;
  loginTitle: string;
  loginSubtitle: string;
  loginButton: string;
  logout: string;
  searchPlaceholder: string;
  allCategories: string;
  categories: string;
  bookmarks: string;
  totalBookmarks: string;
  totalCategories: string;
  activeFilters: string;
  editingBookmark: string;
  editingCategory: string;
  addCategory: string;
  addBookmark: string;
  edit: string;
  delete: string;
  cancel: string;
  save: string;
  open: string;
  token: string;
  tokenPlaceholder: string;
  tokenSaved: string;
  tokenRequired: string;
  dbUnavailable: string;
  emptyBookmarks: string;
  emptyCategories: string;
  categoryName: string;
  parentCategory: string;
  noParent: string;
  categoryColor: string;
  bookmarkTitle: string;
  bookmarkUrl: string;
  bookmarkDescription: string;
  bookmarkCategory: string;
  descriptionOptional: string;
  confirmDelete: string;
  actionMessages: Record<BookmarkActionCode, string>;
  categoryColors: Record<CategoryColorId, string>;
  sortBy: string;
  sortOrder: string;
  sortCreatedAt: string;
  sortTitle: string;
  sortUrl: string;
  sortAsc: string;
  sortDesc: string;
  advancedSort: string;
  advancedSortLabel: string;
  localSort: string;
  hide: string;
  page: string;
  pageSize: string;
  next: string;
  previous: string;
  viewBookmarks: string;
}

/** Trạng thái Form đang mở (Thêm/Sửa Bookmark hoặc Category) */
export type PanelMode =
  | { type: 'bookmark'; bookmark?: Bookmark }
  | { type: 'category'; category?: Category }
  | null;
