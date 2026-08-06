'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import {
  createBookmark,
  createCategory,
  deleteBookmark,
  deleteCategory,
  loadBookmarkDashboard,
  updateBookmark,
  updateCategory,
} from '@/features/bookmarks/api';
import type {
  BookmarkActionResult,
  BookmarkDashboardData,
  PanelMode,
} from '@/features/bookmarks/types';

/** State quản lý các tham số lọc Bookmark */
export interface BookmarkFiltersState {
  query: string;
  categoryId: string;
  page: number;
  pageSize: number;
  sortBy: 'createdAt' | 'title' | 'url';
  sortOrder: 'asc' | 'desc';
}

const DEFAULT_FILTERS: BookmarkFiltersState = {
  query: '',
  categoryId: '',
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export interface DeleteConfirmState {
  isOpen: boolean;
  id: string;
  isCategory: boolean;
}

const emptySubscribe = () => () => {};

/**
 * Custom Hook useBookmarkDashboard quản lý toàn bộ nghiệp vụ, state và tương tác API của phân hệ Bookmark.
 */
export function useBookmarkDashboard() {
  const tCommon = useTranslations('common');
  const tBookmarks = useTranslations('bookmarks');
  const { error: showErrorToast } = useToast();
  const { token, isAuthenticated, initiateGoogleLogin, handleLogout } = useAuth();

  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [filters, setFilters] = React.useState<BookmarkFiltersState>(DEFAULT_FILTERS);
  const [selectedSidebarCategoryId, setSelectedSidebarCategoryId] = React.useState<string>('');
  const [data, setData] = React.useState<BookmarkDashboardData | null>(null);
  const [panelMode, setPanelMode] = React.useState<PanelMode>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const [deleteConfirmState, setDeleteConfirmState] = React.useState<DeleteConfirmState>({
    isOpen: false,
    id: '',
    isCategory: false,
  });

  const updateUrl = React.useCallback((nextFilters: BookmarkFiltersState) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();

    if (nextFilters.query) params.set('q', nextFilters.query);
    if (nextFilters.categoryId) params.set('category', nextFilters.categoryId);
    if (nextFilters.page !== 1) params.set('page', nextFilters.page.toString());
    if (nextFilters.pageSize !== 20) params.set('pageSize', nextFilters.pageSize.toString());
    if (nextFilters.sortBy !== 'createdAt') params.set('sortBy', nextFilters.sortBy);
    if (nextFilters.sortOrder !== 'desc') params.set('sortOrder', nextFilters.sortOrder);

    const suffix = params.toString() ? `?${params.toString()}` : '';
    window.history.replaceState(null, '', `${window.location.pathname}${suffix}`);
  }, []);

  const loadDashboard = React.useCallback(
    async (
      currentToken: string,
      nextFilters: BookmarkFiltersState,
      options: { showError?: boolean; skipCategories?: boolean } = {},
    ) => {
      setIsLoading(true);
      const result = await loadBookmarkDashboard({
        token: currentToken,
        query: nextFilters.query,
        categoryId: nextFilters.categoryId,
        page: nextFilters.page,
        pageSize: nextFilters.pageSize,
        sortBy: nextFilters.sortBy,
        sortOrder: nextFilters.sortOrder,
        skipCategories: options.skipCategories,
      });
      setIsLoading(false);

      if (!result.ok) {
        setData(null);
        if (options.showError ?? true) {
          if (result.code === 'auth_invalid') {
            showErrorToast(tCommon('auth.token.invalid'));
            setMessage(null);
          } else {
            setMessage(tCommon('errors.unknown'));
          }
        }
        return false;
      }

      setData((prevData) => {
        if (!prevData) return result.data;
        return {
          ...result.data,
          categories: options.skipCategories ? prevData.categories : result.data.categories,
          categoryTree: options.skipCategories ? prevData.categoryTree : result.data.categoryTree,
        };
      });
      setMessage(null);

      if (nextFilters.categoryId) {
        setSelectedSidebarCategoryId(nextFilters.categoryId);
      }

      return true;
    },
    [tCommon, showErrorToast],
  );

  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (!mounted || !token) return;

    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const params = new URLSearchParams(window.location.search);
    const sortByParam = params.get('sortBy');
    const sortOrderParam = params.get('sortOrder');

    const initialFilters: BookmarkFiltersState = {
      query: params.get('q') ?? '',
      categoryId: params.get('category') ?? '',
      page: parseInt(params.get('page') ?? '1', 10),
      pageSize: parseInt(params.get('pageSize') ?? '20', 10),
      sortBy:
        sortByParam === 'createdAt' || sortByParam === 'title' || sortByParam === 'url'
          ? sortByParam
          : 'createdAt',
      sortOrder: sortOrderParam === 'asc' || sortOrderParam === 'desc' ? sortOrderParam : 'desc',
    };

    setFilters(initialFilters);
    void loadDashboard(token, initialFilters, { showError: false });
  }, [mounted, token, loadDashboard]);

  const updateFilters = (next: Partial<BookmarkFiltersState>) => {
    const nextFilters = {
      query: next.query ?? filters.query,
      categoryId: next.categoryId !== undefined ? next.categoryId : filters.categoryId,
      page:
        (next.query !== undefined && next.query !== filters.query) ||
        (next.categoryId !== undefined && next.categoryId !== filters.categoryId)
          ? 1
          : (next.page ?? filters.page),
      pageSize: next.pageSize ?? filters.pageSize,
      sortBy: next.sortBy ?? filters.sortBy,
      sortOrder: next.sortOrder ?? filters.sortOrder,
    };

    setFilters(nextFilters);
    updateUrl(nextFilters);

    if (token) {
      void loadDashboard(token, nextFilters, {
        showError: true,
        skipCategories: true,
      });
    }
  };

  const runMutation = (
    form: HTMLFormElement,
    action: (token: string, formData: FormData) => Promise<BookmarkActionResult>,
  ) => {
    if (!token) {
      showErrorToast(tCommon('auth.token.required'));
      return;
    }

    startTransition(async () => {
      const result = await action(token, new FormData(form));
      if (!result.ok) {
        showErrorToast(tCommon('errors.unknown'));
        return;
      }

      form.reset();
      setPanelMode(null);
      await loadDashboard(token, filters, {
        showError: true,
        skipCategories: panelMode?.type !== 'category',
      });
    });
  };

  const requestDelete = (id: string, isCategory: boolean = false) => {
    setDeleteConfirmState({ isOpen: true, id, isCategory });
  };

  const confirmDelete = () => {
    const { id, isCategory } = deleteConfirmState;
    if (!id || !token) return;

    setDeleteConfirmState({ isOpen: false, id: '', isCategory: false });

    startTransition(async () => {
      const action = isCategory ? deleteCategory : deleteBookmark;
      const result = await action(token, id);
      if (result.ok) {
        await loadDashboard(token, filters, {
          showError: true,
          skipCategories: !isCategory,
        });
      } else {
        showErrorToast(tCommon('errors.unknown'));
      }
    });
  };

  const cancelDelete = () => {
    setDeleteConfirmState({ isOpen: false, id: '', isCategory: false });
  };

  const handlePanelSubmit = (form: HTMLFormElement) => {
    if (!panelMode) return;

    if (panelMode.type === 'bookmark') {
      runMutation(form, panelMode.bookmark ? updateBookmark : createBookmark);
      return;
    }

    runMutation(form, panelMode.category ? updateCategory : createCategory);
  };

  return {
    mounted,
    isAuthenticated,
    token,
    data,
    filters,
    selectedSidebarCategoryId,
    panelMode,
    message,
    isLoading,
    isPending,
    deleteConfirmState,
    setSelectedSidebarCategoryId,
    setPanelMode,
    updateFilters,
    handlePanelSubmit,
    requestDelete,
    confirmDelete,
    cancelDelete,
    initiateGoogleLogin,
    handleLogout,
    tCommon,
    tBookmarks,
  };
}
