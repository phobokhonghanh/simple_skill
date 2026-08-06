import type {
  BookmarkActionCode,
  BookmarkActionResult,
  BookmarkDashboardLoadResult,
  Category,
  CategoryTreeNode,
  Bookmark,
  PaginationMetadata,
} from '@/features/bookmarks/types';

/** Base API URL từ biến môi trường public */
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

/** Generic ApiResponse wrapper từ Backend */
interface ApiResponse<T = unknown> {
  ok: boolean;
  code: BookmarkActionCode;
  data?: T;
  pagination?: PaginationMetadata;
}

/**
 * Hàm gọi API chung tự động thêm Authorization Bearer token và JSON header.
 *
 * @param path - Đường dẫn API endpoint.
 * @param token - Bearer Token xác thực.
 * @param init - Tùy chọn fetch RequestInit.
 * @returns ApiResponse chứa kết quả dữ liệu hoặc mã lỗi.
 */
const request = async <T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> => {
  if (!API_URL) {
    return { ok: false, code: 'db_unavailable' };
  }

  try {
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
    const body = (await response.json()) as ApiResponse<T>;

    return body;
  } catch {
    return { ok: false, code: 'unknown_error' };
  }
};

/** Lấy chuỗi từ FormData có trim khoảng trắng */
const formValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

/** Lấy payload Bookmark từ FormData */
const bookmarkPayload = (formData: FormData) => ({
  title: formValue(formData, 'title'),
  url: formValue(formData, 'url'),
  description: formValue(formData, 'description') || null,
  categoryId: formValue(formData, 'categoryId'),
});

/** Lấy payload Category từ FormData */
const categoryPayload = (formData: FormData) => ({
  name: formValue(formData, 'name'),
  color: formValue(formData, 'color'),
  parentId: formValue(formData, 'parentId') || null,
});

/**
 * Chuyển đổi cây danh mục (CategoryTreeNode[]) thành mảng phẳng các Danh mục (Category[]).
 *
 * @param nodes - Cây danh mục đầu vào.
 * @returns Mảng danh mục phẳng.
 */
function flattenCategoryTree(nodes: CategoryTreeNode[]): Category[] {
  const result: Category[] = [];
  const traverse = (node: CategoryTreeNode) => {
    const flat: Category = {
      id: node.id,
      name: node.name,
      slug: node.slug,
      color: node.color,
      parentId: node.parentId,
      createdAt: node.createdAt,
    };
    result.push(flat);
    if (node.children && node.children.length > 0) {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return result;
}

/**
 * Nạp danh sách Bookmarks, Cây Danh mục và Metadata phân trang cho trang BookmarkDashboard.
 *
 * @param options - Đối tượng tham số gồm token, query, categoryId, page, pageSize, sortBy, sortOrder và skipCategories.
 * @returns BookmarkDashboardLoadResult chứa dữ liệu BookmarkDashboardData hoặc báo lỗi.
 */
export const loadBookmarkDashboard = async ({
  token,
  query,
  categoryId,
  page = 1,
  pageSize = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  skipCategories = false,
}: {
  token: string;
  query?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'title' | 'url';
  sortOrder?: 'asc' | 'desc';
  skipCategories?: boolean;
}): Promise<BookmarkDashboardLoadResult> => {
  const bookmarksParams = new URLSearchParams();
  if (query) bookmarksParams.set('q', query);
  if (categoryId) bookmarksParams.set('categoryId', categoryId);
  bookmarksParams.set('page', page.toString());
  bookmarksParams.set('pageSize', pageSize.toString());
  bookmarksParams.set('sortBy', sortBy);
  bookmarksParams.set('sortOrder', sortOrder);

  if (skipCategories) {
    try {
      const bookmarksRes = await request<Bookmark[]>(
        `/api/bookmarks?${bookmarksParams.toString()}`,
        token,
      );

      if (!bookmarksRes.ok || !bookmarksRes.data) {
        return {
          ok: false,
          code:
            bookmarksRes.code === 'ok' ? 'unknown_error' : bookmarksRes.code,
        };
      }

      const bookmarks = bookmarksRes.data;
      const pagination: PaginationMetadata = bookmarksRes.pagination ?? {
        total: bookmarks.length,
        page,
        pageSize,
        totalPages: Math.ceil(bookmarks.length / pageSize) || 1,
      };

      return {
        ok: true,
        code: 'ok',
        data: {
          bookmarks,
          categories: [],
          categoryTree: [],
          selectedCategoryIds: categoryId ? [categoryId] : [],
          dbReady: true,
          pagination,
        },
      };
    } catch {
      return { ok: false, code: 'unknown_error' };
    }
  }

  const categoriesParams = new URLSearchParams();
  categoriesParams.set('pageSize', '100');

  try {
    const [categoriesRes, bookmarksRes] = await Promise.all([
      request<CategoryTreeNode[]>(
        `/api/categories?${categoriesParams.toString()}`,
        token,
      ),
      request<Bookmark[]>(
        `/api/bookmarks?${bookmarksParams.toString()}`,
        token,
      ),
    ]);

    if (!categoriesRes.ok || !categoriesRes.data) {
      return {
        ok: false,
        code:
          categoriesRes.code === 'ok' ? 'unknown_error' : categoriesRes.code,
      };
    }

    if (!bookmarksRes.ok || !bookmarksRes.data) {
      return {
        ok: false,
        code: bookmarksRes.code === 'ok' ? 'unknown_error' : bookmarksRes.code,
      };
    }

    const categoryTree = Array.isArray(categoriesRes.data)
      ? categoriesRes.data
      : (categoriesRes.data as { categoryTree?: CategoryTreeNode[] })
          ?.categoryTree ?? [];
    const bookmarks = Array.isArray(bookmarksRes.data)
      ? bookmarksRes.data
      : (bookmarksRes.data as { bookmarks?: Bookmark[] })?.bookmarks ?? [];
    const pagination: PaginationMetadata = bookmarksRes.pagination ?? {
      total: bookmarks.length,
      page,
      pageSize,
      totalPages: Math.ceil(bookmarks.length / pageSize) || 1,
    };
    const categories = flattenCategoryTree(categoryTree);

    return {
      ok: true,
      code: 'ok',
      data: {
        bookmarks,
        categories,
        categoryTree,
        selectedCategoryIds: categoryId ? [categoryId] : [],
        dbReady: true,
        pagination,
      },
    };
  } catch {
    return { ok: false, code: 'unknown_error' };
  }
};

/** Thực hiện request biến đổi dữ liệu (POST, PUT, DELETE) */
const mutate = async (
  path: string,
  token: string,
  method: string,
  body?: object,
): Promise<BookmarkActionResult> => {
  const result = await request(path, token, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ok: result.ok, code: result.code };
};

/** Tạo một Bookmark mới */
export const createBookmark = (token: string, formData: FormData) =>
  mutate('/api/bookmarks', token, 'POST', bookmarkPayload(formData));

/** Cập nhật thông tin Bookmark hiện có */
export const updateBookmark = (token: string, formData: FormData) =>
  mutate(
    `/api/bookmarks/${encodeURIComponent(formValue(formData, 'id'))}`,
    token,
    'PUT',
    bookmarkPayload(formData),
  );

/** Xóa một Bookmark theo ID */
export const deleteBookmark = (token: string, id: string) =>
  mutate(`/api/bookmarks/${encodeURIComponent(id)}`, token, 'DELETE');

/** Tạo một Danh mục (Category) mới */
export const createCategory = (token: string, formData: FormData) =>
  mutate('/api/categories', token, 'POST', categoryPayload(formData));

/** Cập nhật một Danh mục (Category) hiện có */
export const updateCategory = (token: string, formData: FormData) =>
  mutate(
    `/api/categories/${encodeURIComponent(formValue(formData, 'id'))}`,
    token,
    'PUT',
    categoryPayload(formData),
  );

/** Xóa một Danh mục (Category) theo ID */
export const deleteCategory = (token: string, id: string) =>
  mutate(`/api/categories/${encodeURIComponent(id)}`, token, 'DELETE');
