'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  CATEGORY_COLOR_PRESETS,
  DEFAULT_CATEGORY_COLOR,
  getCategoryColorPreset,
} from '@/features/bookmarks/colors';
import type { CategoryTreeNode } from '@/features/bookmarks/types';
import type {
  BookmarkDashboardLabels,
  PanelMode,
} from '@/features/bookmarks/types';

/** Props cho Component BookmarkForms */
interface BookmarkFormsProps {
  /** Chế độ Form hiện tại ('bookmark' hoặc 'category') */
  panelMode: Exclude<PanelMode, null>;
  /** ID danh mục đang chọn */
  selectedCategoryId: string;
  /** Cây danh mục dùng cho select dropdown */
  categoryTree: CategoryTreeNode[];
  /** Nhãn ngôn ngữ i18n */
  labels: BookmarkDashboardLabels;
  /** Trạng thái đang lưu/gửi dữ liệu */
  isPending: boolean;
  /** Callback hủy/đóng Form */
  onCancel: () => void;
  /** Callback gửi Form */
  onSubmit: (form: HTMLFormElement) => void;
}

/** Sub-component render tùy chọn Danh mục cây phân cấp trong thẻ <select> */
function CategoryOption({
  category,
  depth = 0,
}: {
  category: CategoryTreeNode;
  depth?: number;
}) {
  return (
    <>
      <option value={category.id}>
        {'- '.repeat(depth)}
        {category.name}
      </option>
      {category.children.map((child) => (
        <CategoryOption key={child.id} category={child} depth={depth + 1} />
      ))}
    </>
  );
}

/** Sub-component bộ chọn Màu đại diện cho Danh mục */
function CategoryColorPicker({
  defaultColor,
  labels,
}: {
  defaultColor: string;
  labels: BookmarkDashboardLabels;
}) {
  return (
    <fieldset className="grid gap-2 md:col-span-2">
      <legend className="text-sm font-medium">{labels.categoryColor}</legend>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_COLOR_PRESETS.map((preset) => {
          const isDefault = preset.id === defaultColor;
          return (
            <label
              key={preset.id}
              className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background"
            >
              <input
                type="radio"
                name="color"
                value={preset.id}
                defaultChecked={isDefault}
                className="sr-only"
              />
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: preset.foreground }}
              />
              {labels.categoryColors[preset.id]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Component Form tổng hợp cho phép tạo/chỉnh sửa Bookmark hoặc Danh mục (Category).
 * Tự động chuyển đổi giao diện dựa trên `panelMode.type`.
 *
 * @param props - BookmarkFormsProps.
 * @returns JSX Element Form Thêm/Sửa Bookmark hoặc Category.
 */
export function BookmarkForms({
  panelMode,
  selectedCategoryId,
  categoryTree,
  labels,
  isPending,
  onCancel,
  onSubmit,
}: BookmarkFormsProps) {
  if (panelMode.type === 'bookmark') {
    return (
      <Card className="bg-muted/25 border rounded-lg p-0 gap-0">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-semibold">
            {labels.editingBookmark}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0">
            {labels.descriptionOptional}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(event.currentTarget);
            }}
          >
            {panelMode.bookmark && (
              <input type="hidden" name="id" value={panelMode.bookmark.id} />
            )}
            <label className="grid gap-1 text-sm font-medium">
              {labels.bookmarkTitle}
              <input
                name="title"
                defaultValue={panelMode.bookmark?.title}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {labels.bookmarkUrl}
              <input
                name="url"
                defaultValue={panelMode.bookmark?.url}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium md:col-span-2">
              {labels.bookmarkDescription}
              <textarea
                name="description"
                defaultValue={panelMode.bookmark?.description ?? ''}
                placeholder={labels.descriptionOptional}
                className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {labels.bookmarkCategory}
              <select
                name="categoryId"
                defaultValue={
                  panelMode.bookmark?.categoryId ??
                  selectedCategoryId ??
                  categoryTree[0]?.id
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categoryTree.map((category) => (
                  <CategoryOption key={category.id} category={category} />
                ))}
              </select>
            </label>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={isPending} className="shadow-sm">
                {labels.save}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                {labels.cancel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  const defaultColor =
    panelMode.category?.color ??
    getCategoryColorPreset(DEFAULT_CATEGORY_COLOR).id;

  return (
    <Card className="bg-muted/25 border rounded-lg p-0 gap-0">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-sm font-semibold">
          {labels.editingCategory}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0">
          {labels.parentCategory}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(event.currentTarget);
          }}
        >
          {panelMode.category && (
            <input type="hidden" name="id" value={panelMode.category.id} />
          )}
          <label className="grid gap-1 text-sm font-medium">
            {labels.categoryName}
            <input
              name="name"
              defaultValue={panelMode.category?.name}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {labels.parentCategory}
            <select
              name="parentId"
              defaultValue={panelMode.category?.parentId ?? ''}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">{labels.noParent}</option>
              {categoryTree.map((category) => (
                <CategoryOption key={category.id} category={category} />
              ))}
            </select>
          </label>
          <CategoryColorPicker defaultColor={defaultColor} labels={labels} />
          <div className="flex items-end gap-2 md:col-span-2">
            <Button type="submit" disabled={isPending} className="shadow-sm">
              {labels.save}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {labels.cancel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
