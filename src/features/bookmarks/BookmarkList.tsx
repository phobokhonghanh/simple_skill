'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Edit3,
  ExternalLink,
  LinkIcon,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Loader2,
  ChevronDown,
  Plus,
  Bookmark as BookmarkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCategoryColorPreset } from '@/features/bookmarks/colors';
import type {
  Bookmark,
  PaginationMetadata,
  BookmarkFilters,
} from '@/features/bookmarks/types';

/** Props cho Component Danh sách Bookmark (BookmarkList) */
interface BookmarkListProps {
  /** Mảng danh sách các Bookmark hiện tại */
  bookmarks: Bookmark[];
  /** Cấu trúc phân trang */
  pagination: PaginationMetadata;
  /** Bộ lọc hiện tại */
  filters: BookmarkFilters;
  /** Trạng thái đang tải dữ liệu */
  isLoading: boolean;
  /** Quyền tạo Bookmark mới */
  canCreateBookmark: boolean;
  /** Callback cập nhật bộ lọc */
  onUpdateFilters: (next: Partial<BookmarkFilters>) => void;
  /** Callback chỉnh sửa Bookmark */
  onEdit: (bookmark: Bookmark) => void;
  /** Callback xóa Bookmark */
  onDelete: (bookmarkId: string) => void;
  /** Callback mở form tạo mới Bookmark */
  onCreateBookmark: () => void;
}

/**
 * Component BookmarkList hiển thị danh sách các thẻ Bookmark kèm ô tìm kiếm, bộ lọc nâng cao và sắp xếp tại Client.
 *
 * @param props - BookmarkListProps.
 * @returns JSX Element danh sách Bookmark.
 */
export function BookmarkList({
  bookmarks,
  filters,
  isLoading,
  canCreateBookmark,
  onUpdateFilters,
  onEdit,
  onDelete,
  onCreateBookmark,
}: BookmarkListProps) {
  const tBookmarks = useTranslations('bookmarks');
  const tCommon = useTranslations('common');

  // Trạng thái sắp xếp địa phương ở Client-side
  const [localSortBy, setLocalSortBy] = React.useState<
    'createdAt' | 'title' | 'url'
  >(filters.sortBy ?? 'createdAt');
  const [localSortOrder, setLocalSortOrder] = React.useState<'asc' | 'desc'>(
    filters.sortOrder ?? 'desc',
  );
  const [isAdvancedSortOpen, setIsAdvancedSortOpen] = React.useState(false);
  const [prevBookmarks, setPrevBookmarks] = React.useState(bookmarks);

  // Cập nhật lại state khi props bookmarks thay đổi từ Server
  if (bookmarks !== prevBookmarks) {
    setPrevBookmarks(bookmarks);
    setLocalSortBy(filters.sortBy ?? 'createdAt');
    setLocalSortOrder(filters.sortOrder ?? 'desc');
  }

  const handleLocalSort = (field: 'createdAt' | 'title' | 'url') => {
    if (localSortBy === field) {
      setLocalSortOrder(localSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setLocalSortBy(field);
      setLocalSortOrder(field === 'createdAt' ? 'desc' : 'asc');
    }
  };

  const renderLocalSortHeader = (
    field: 'createdAt' | 'title' | 'url',
    label: string,
  ) => {
    const isSorted = localSortBy === field;
    const isAsc = localSortOrder === 'asc';

    return (
      <button
        type="button"
        onClick={() => handleLocalSort(field)}
        className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider outline-none transition-colors hover:text-foreground ${
          isSorted ? 'text-foreground font-bold' : 'text-muted-foreground'
        }`}
      >
        {label}
        {isSorted ? (
          isAsc ? (
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
        )}
      </button>
    );
  };

  const sortedBookmarks = React.useMemo(() => {
    return [...bookmarks].sort((a, b) => {
      let valA: string | number = a[localSortBy] ?? '';
      let valB: string | number = b[localSortBy] ?? '';

      if (localSortBy === 'createdAt') {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return localSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return localSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [bookmarks, localSortBy, localSortOrder]);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      {/* Thẻ Ô Tìm kiếm & Bộ lọc Sắp xếp API nâng cao */}
      <Card className="rounded-md border bg-background shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary p-0 gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-1.5 gap-2">
          <form
            className="flex w-full flex-1 items-center gap-1"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const value = formData.get('q');
              onUpdateFilters({
                query: typeof value === 'string' ? value.trim() : '',
                page: 1,
              });
            }}
          >
            <div className="relative flex-1 flex items-center">
              {isLoading ? (
                <Loader2 className="absolute left-3 h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              )}
              <input
                name="q"
                defaultValue={filters.query}
                disabled={isLoading}
                placeholder={tBookmarks('search_placeholder') || 'Search bookmarks...'}
                className="h-9 w-full bg-transparent pl-9 pr-3 text-sm outline-none disabled:opacity-75"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
              className="h-8 px-3 shrink-0"
              title={tBookmarks('search_placeholder') || 'Search'}
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="px-2 shrink-0 border-l border-transparent sm:border-muted pl-2">
            <button
              type="button"
              onClick={() => setIsAdvancedSortOpen(!isAdvancedSortOpen)}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{tBookmarks('sort.advanced') || 'Advanced Sort'}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${isAdvancedSortOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {isAdvancedSortOpen && (
          <div className="flex flex-wrap items-center gap-3 border-t bg-muted/20 px-3 py-2.5 animate-in slide-in-from-top-1">
            <span className="text-xs text-muted-foreground font-medium">
              {tBookmarks('sort.label') || 'Sort By'}:
            </span>
            <select
              value={filters.sortBy ?? 'createdAt'}
              onChange={(e) =>
                onUpdateFilters({
                  sortBy: e.target.value as 'createdAt' | 'title' | 'url',
                  page: 1,
                })
              }
              className="h-7 rounded bg-background px-2 text-xs outline-none border border-input focus:ring-1 focus:ring-ring"
            >
              <option value="createdAt">{tBookmarks('sort.created_at') || 'Date Created'}</option>
              <option value="title">{tBookmarks('forms.title') || 'Title'}</option>
              <option value="url">{tBookmarks('forms.url') || 'URL'}</option>
            </select>
            <select
              value={filters.sortOrder ?? 'desc'}
              onChange={(e) =>
                onUpdateFilters({
                  sortOrder: e.target.value as 'asc' | 'desc',
                  page: 1,
                })
              }
              className="h-7 rounded bg-background px-2 text-xs outline-none border border-input focus:ring-1 focus:ring-ring"
            >
              <option value="asc">{tBookmarks('sort.asc') || 'Ascending'}</option>
              <option value="desc">{tBookmarks('sort.desc') || 'Descending'}</option>
            </select>
          </div>
        )}
      </Card>

      {/* Thẻ Danh sách Bookmark & Tiêu đề Sắp xếp Địa phương */}
      <Card className="rounded-md border bg-card shadow-sm p-0 gap-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 px-3 py-2">
          <Button
            type="button"
            onClick={onCreateBookmark}
            disabled={!canCreateBookmark || isLoading}
            size="icon-sm"
            variant="secondary"
            className="h-8 w-8 shrink-0 bg-background shadow-sm hover:bg-muted"
            title={tBookmarks('add_bookmark') || 'Add Bookmark'}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4 text-xs pr-1">
            <span className="hidden sm:inline-block text-muted-foreground font-medium mr-1">
              {tBookmarks('sort.local') || 'Local Sort:'}
            </span>
            {renderLocalSortHeader('title', tBookmarks('forms.title') || 'Title')}
            {renderLocalSortHeader('url', tBookmarks('forms.url') || 'URL')}
            {renderLocalSortHeader('createdAt', tBookmarks('sort.created_at') || 'Date')}
          </div>
        </div>

        {sortedBookmarks.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={BookmarkIcon}
              title={tBookmarks('empty_bookmarks') || 'No Bookmarks Found'}
              description={tBookmarks('empty_bookmarks_desc') || 'Try searching with another keyword or add a new bookmark.'}
              actionLabel={canCreateBookmark ? (tBookmarks('add_bookmark') || 'Add Bookmark') : undefined}
              onAction={canCreateBookmark ? onCreateBookmark : undefined}
              actionIcon={Plus}
            />
          </div>
        ) : (
          <ul className="divide-y">
            {sortedBookmarks.map((bookmark) => {
              const color = getCategoryColorPreset(bookmark.categoryColor);

              return (
                <li
                  key={bookmark.id}
                  className="grid gap-3 border-l-4 bg-background px-4 py-4 transition-colors hover:bg-muted/30 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                  style={{
                    borderLeftColor: color.foreground,
                    backgroundColor: color.background,
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold tracking-tight">
                        {bookmark.title}
                      </h3>
                      <span
                        className="rounded-md border px-2 py-0.5 text-xs font-medium"
                        style={{
                          borderColor: color.border,
                          color: color.foreground,
                          backgroundColor: color.background,
                        }}
                      >
                        {bookmark.categoryName}
                      </span>
                    </div>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex min-w-0 items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80 hover:underline"
                    >
                      <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{bookmark.url}</span>
                    </a>
                    {bookmark.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {bookmark.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      asChild
                      title={tCommon('buttons.open') || 'Open'}
                    >
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      title={tCommon('buttons.edit') || 'Edit'}
                      onClick={() => onEdit(bookmark)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      title={tCommon('buttons.delete') || 'Delete'}
                      onClick={() => onDelete(bookmark.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
