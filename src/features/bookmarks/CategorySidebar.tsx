'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  ChevronRight,
  Edit3,
  Folder,
  FolderOpen,
  FolderPlus,
  Trash2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getCategoryColorPreset,
  type CategoryColorId,
} from '@/features/bookmarks/colors';
import type { CategoryTreeNode } from '@/features/bookmarks/types';

/** Props cho Component CategorySidebar */
interface CategorySidebarProps {
  /** Cây danh mục */
  nodes: CategoryTreeNode[];
  /** ID danh mục đang chọn */
  selectedCategoryId: string;
  /** ID danh mục đang lọc */
  filterCategoryId: string;
  /** Callback chọn danh mục */
  onSelect: (categoryId: string) => void;
  /** Callback lọc theo danh mục */
  onFilter: (categoryId: string) => void;
  /** Callback mở modal tạo danh mục */
  onCreateCategory: () => void;
  /** Callback sửa danh mục */
  onEdit: (category: CategoryTreeNode) => void;
  /** Callback xóa danh mục */
  onDelete: (categoryId: string) => void;
}

/** Sub-component hiển thị chấm màu đại diện cho danh mục */
function CategoryDot({ color }: { color: CategoryColorId }) {
  const preset = getCategoryColorPreset(color);

  return (
    <span
      className="size-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: preset.foreground }}
    />
  );
}

/**
 * Component CategorySidebar hiển thị cây danh mục dạng Sidebar bên trái cho tính năng Bookmark.
 * Hỗ trợ các hành động: lọc theo danh mục, thêm mới, chỉnh sửa và xóa danh mục.
 *
 * @param props - CategorySidebarProps.
 * @returns JSX Element Sidebar cây danh mục.
 */
export function CategorySidebar({
  nodes,
  selectedCategoryId,
  filterCategoryId,
  onSelect,
  onFilter,
  onCreateCategory,
  onEdit,
  onDelete,
}: CategorySidebarProps) {
  const tBookmarks = useTranslations('bookmarks');
  const tCommon = useTranslations('common');

  const renderNode = (node: CategoryTreeNode) => {
    const isSelected = selectedCategoryId === node.id;
    const isFiltered = filterCategoryId === node.id;
    const hasChildren = node.children.length > 0;
    const color = getCategoryColorPreset(node.color);
    const FolderIcon = isSelected || hasChildren ? FolderOpen : Folder;

    return (
      <li key={node.id} className="relative pl-3">
        <span className="absolute left-0 top-0 h-full w-px bg-border/80" />
        <span className="absolute left-0 top-5 h-px w-3 bg-border/80" />
        <div
          className={`group flex items-center gap-1 rounded-md transition-colors ${
            isSelected
              ? 'bg-foreground text-background shadow-sm'
              : 'text-foreground hover:bg-muted/80'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect(node.id)}
            className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <span className="flex min-w-0 items-center gap-2">
              <ChevronRight
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  hasChildren ? 'rotate-90 opacity-80' : 'opacity-20'
                }`}
              />
              <FolderIcon
                className="h-4 w-4 shrink-0"
                style={{ color: isSelected ? undefined : color.foreground }}
              />
              <CategoryDot color={node.color} />
              <span className="truncate">{node.name}</span>
            </span>
            {hasChildren && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isSelected
                    ? 'bg-background/20 text-background'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {node.children.length}
              </span>
            )}
          </button>
          <div
            className={`flex shrink-0 items-center pr-1 transition-opacity ${
              isFiltered
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
            }`}
          >
            <button
              type="button"
              className={`rounded-md p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                isFiltered
                  ? isSelected
                    ? 'text-primary bg-background/25'
                    : 'text-primary bg-primary/10'
                  : isSelected
                    ? 'text-background/80 hover:bg-background/20'
                    : 'text-muted-foreground hover:bg-background'
              }`}
              title={tBookmarks('actions.view_bookmarks') || 'View Bookmarks'}
              onClick={(e) => {
                e.stopPropagation();
                onFilter(node.id);
              }}
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className={`rounded-md p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                isSelected ? 'hover:bg-background/20' : 'hover:bg-background'
              }`}
              title={tCommon('buttons.edit') || 'Edit'}
              onClick={() => onEdit(node)}
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className={`rounded-md p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                isSelected
                  ? 'text-background hover:bg-background/20'
                  : 'text-destructive hover:bg-destructive/10'
              }`}
              title={tCommon('buttons.delete') || 'Delete'}
              onClick={() => onDelete(node.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {hasChildren && (
          <ul className="ml-4 mt-1 space-y-1">
            {node.children.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className="p-4 lg:sticky lg:top-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">
            {tBookmarks('categories_title') || 'Categories'}
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          title={tBookmarks('add_category') || 'Add Category'}
          onClick={onCreateCategory}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>
      <button
        type="button"
        onClick={() => {
          onSelect('');
          onFilter('');
        }}
        className={`mb-3 flex w-full items-center rounded-md px-3 py-2 text-left text-sm outline-none transition-all duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
          filterCategoryId
            ? 'text-foreground hover:bg-muted/80'
            : 'bg-foreground text-background shadow-sm'
        }`}
      >
        {tBookmarks('all_categories') || 'All Categories'}
      </button>
      {nodes.length === 0 ? (
        <p className="px-3 text-sm text-muted-foreground">
          {tBookmarks('empty_categories') || 'No categories created yet.'}
        </p>
      ) : (
        <ul className="space-y-1">{nodes.map((node) => renderNode(node))}</ul>
      )}
    </aside>
  );
}
