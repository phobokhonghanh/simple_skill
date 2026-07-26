import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BookmarkDashboard } from '@/features/bookmarks/BookmarkDashboard';
import { CATEGORY_COLOR_PRESETS } from '@/features/bookmarks/colors';

/**
 * Sinh các tham số tĩnh cho các locale được hỗ trợ.
 *
 * @returns Mảng đối tượng tham số locale.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Tạo metadata động (Tiêu đề & Mô tả) cho trang Bookmarks dựa theo ngôn ngữ.
 *
 * @param props - Object chứa params Promise<{ locale: string }>.
 * @returns Metadata object.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bookmarks' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

/**
 * Trang Quản lý Bookmark cá nhân (BookmarksPage).
 * Nạp các bản dịch i18n và truyền đối tượng labels hoàn chỉnh vào BookmarkDashboard.
 *
 * @param props - Props chứa params locale.
 * @returns JSX Element BookmarkDashboard.
 */
export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'bookmarks' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tAuth = await getTranslations({ locale, namespace: 'auth' });

  return (
    <BookmarkDashboard
      labels={{
        subtitle: t('dashboard.subtitle'),
        loginTitle: tCommon('auth.token.title'),
        loginSubtitle: tCommon('auth.token.subtitle'),
        loginButton: tCommon('buttons.open'),
        logout: tAuth('buttons.logout'),
        searchPlaceholder: t('dashboard.search_placeholder'),
        allCategories: t('categories.all'),
        categories: t('categories.title'),
        bookmarks: t('bookmarks_title'),
        totalBookmarks: t('dashboard.total_bookmarks'),
        totalCategories: t('dashboard.total_categories'),
        activeFilters: t('dashboard.active_filters'),
        editingBookmark: t('dashboard.editing_bookmark'),
        editingCategory: t('dashboard.editing_category'),
        addCategory: t('dashboard.add_category'),
        addBookmark: t('dashboard.add_bookmark'),
        edit: tCommon('buttons.edit'),
        delete: tCommon('buttons.delete'),
        cancel: tCommon('buttons.cancel'),
        save: tCommon('buttons.save'),
        open: tCommon('buttons.open'),
        token: tCommon('auth.token.label'),
        tokenPlaceholder: tCommon('auth.token.placeholder'),
        tokenSaved: tCommon('auth.token.saved'),
        tokenRequired: tCommon('auth.token.required'),
        dbUnavailable: tCommon('errors.db_unavailable'),
        emptyBookmarks: t('dashboard.empty_bookmarks'),
        emptyCategories: t('dashboard.empty_categories'),
        categoryName: t('dashboard.category_name'),
        parentCategory: t('dashboard.parent_category'),
        noParent: t('dashboard.no_parent'),
        categoryColor: t('dashboard.category_color'),
        bookmarkTitle: t('dashboard.bookmark_title'),
        bookmarkUrl: t('dashboard.bookmark_url'),
        bookmarkDescription: t('dashboard.bookmark_description'),
        bookmarkCategory: t('dashboard.bookmark_category'),
        descriptionOptional: t('dashboard.description_optional'),
        confirmDelete: tCommon('messages.delete_confirm'),
        sortBy: tCommon('sort.by'),
        sortOrder: tCommon('sort.order'),
        sortCreatedAt: tCommon('sort.fields.created_at'),
        sortTitle: tCommon('sort.fields.title'),
        sortUrl: tCommon('sort.fields.url'),
        sortAsc: tCommon('sort.directions.asc'),
        sortDesc: tCommon('sort.directions.desc'),
        advancedSort: tCommon('sort.types.advanced'),
        advancedSortLabel: tCommon('sort.types.api'),
        localSort: tCommon('sort.types.local'),
        hide: tCommon('buttons.close'),
        page: tCommon('labels.page'),
        pageSize: tCommon('labels.pageSize'),
        next: tCommon('buttons.next'),
        previous: tCommon('buttons.previous'),
        viewBookmarks: t('dashboard.viewBookmarks'),
        actionMessages: {
          ok: tCommon('messages.save_success'),
          auth_invalid: tCommon('auth.token.invalid'),
          auth_missing_config: tCommon('auth.token.missing_config'),
          category_required: t('actions.category_required'),
          category_in_use: t('actions.category_in_use'),
          category_has_children: t('actions.category_has_children'),
          category_not_found: t('actions.category_not_found'),
          bookmark_not_found: t('actions.bookmark_not_found'),
          title_required: tCommon('errors.required'),
          url_invalid: tCommon('errors.invalid_url'),
          db_unavailable: tCommon('errors.db_unavailable'),
          unknown_error: tCommon('errors.unknown'),
        },
        categoryColors: Object.fromEntries(
          CATEGORY_COLOR_PRESETS.map((preset) => [
            preset.id,
            tCommon(preset.labelKey),
          ]),
        ) as Record<(typeof CATEGORY_COLOR_PRESETS)[number]['id'], string>,
      }}
    />
  );
}
