'use client';

import * as React from 'react';
import {
  LogOut,
  Bookmark as BookmarkIcon,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/features/i18n/LanguageSwitcher';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { BookmarkForms } from '@/features/bookmarks/BookmarkForms';
import { BookmarkList } from '@/features/bookmarks/BookmarkList';
import { CategorySidebar } from '@/features/bookmarks/CategorySidebar';
import { useBookmarkDashboard } from '@/features/bookmarks/hooks/useBookmarkDashboard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Bookmark } from '@/features/bookmarks/types';

/**
 * Component BookmarkDashboard quản lý toàn bộ giao diện bảng điều khiển Bookmark cá nhân.
 * Điều phối các sub-components: Header Navbar, Sidebar cây danh mục (`CategorySidebar`),
 * Form Thêm/Sửa (`BookmarkForms`), Danh sách Bookmark (`BookmarkList`) và Modal `ConfirmDialog`.
 *
 * @returns JSX Element Bảng điều khiển BookmarkDashboard.
 */
export function BookmarkDashboard() {
  const {
    mounted,
    isAuthenticated,
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
  } = useBookmarkDashboard();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-4">
        <LoadingSkeleton height="3.5rem" className="w-full" />
        <div className="flex gap-6">
          <LoadingSkeleton height="24rem" className="w-80" />
          <LoadingSkeleton height="24rem" className="flex-1" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Bar trên cùng chứa nút Đăng nhập / Đăng xuất, Đổi ngôn ngữ & Theme */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
          <BookmarkIcon className="h-5 w-5 text-primary" />
          <span>{tBookmarks('bookmarks_title')}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleLogout()}
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {tCommon('buttons.logout') || 'Logout'}
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={initiateGoogleLogin}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {tCommon('auth.login_google') || 'Sign in with Google'}
            </Button>
          )}
          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Trường hợp chưa đăng nhập Google */}
      {!isAuthenticated && (
        <section className="mx-auto flex w-full flex-1 max-w-4xl flex-col items-center justify-center p-6">
          <EmptyState
            icon={BookmarkIcon}
            title={tBookmarks('dashboard.subtitle') || 'Personal Bookmark Manager'}
            description={tCommon('auth.token.subtitle') || 'Sign in with Google to access and manage your personal bookmarks.'}
            actionLabel={tCommon('auth.login_google') || 'Sign in with Google'}
            onAction={initiateGoogleLogin}
            actionIcon={LogIn}
            className="w-full max-w-md my-12"
          />
        </section>
      )}

      {/* Phần giao diện chính chứa Sidebar và Danh sách Bookmark */}
      {isAuthenticated && (
        <section className="mx-auto flex w-full flex-1 max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {data && !data.dbReady && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm">
              {tCommon('errors.db_unavailable')}
            </div>
          )}

          {message && (
            <div className="rounded-lg border bg-card px-4 py-3 text-sm text-card-foreground shadow-sm">
              {message}
            </div>
          )}

          {!data && isLoading ? (
            <div className="flex gap-6">
              <LoadingSkeleton height="28rem" className="w-80 hidden lg:block" />
              <LoadingSkeleton height="28rem" className="flex-1" />
            </div>
          ) : data ? (
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="flex min-h-0 flex-1 flex-col divide-y lg:flex-row lg:divide-x lg:divide-y-0">
                {/* Sidebar Danh mục */}
                <div className="flex w-full shrink-0 flex-col bg-muted/5 lg:w-[280px] xl:w-[320px]">
                  <CategorySidebar
                    nodes={data.categoryTree}
                    selectedCategoryId={selectedSidebarCategoryId}
                    filterCategoryId={filters.categoryId}
                    onSelect={(categoryId) => setSelectedSidebarCategoryId(categoryId)}
                    onFilter={(categoryId) => updateFilters({ categoryId })}
                    onCreateCategory={() => setPanelMode({ type: 'category' })}
                    onEdit={(category) => setPanelMode({ type: 'category', category })}
                    onDelete={(categoryId) => requestDelete(categoryId, true)}
                  />
                </div>

                {/* Khối chính: Form Thêm/Sửa & Danh sách Bookmark */}
                <div className="flex min-w-0 flex-1 flex-col bg-card">
                  {panelMode && (
                    <div className="border-b p-4 sm:p-5">
                      <BookmarkForms
                        panelMode={panelMode}
                        selectedCategoryId={selectedSidebarCategoryId}
                        categoryTree={data.categoryTree}
                        isPending={isPending}
                        onCancel={() => setPanelMode(null)}
                        onSubmit={handlePanelSubmit}
                      />
                    </div>
                  )}

                  <BookmarkList
                    bookmarks={data.bookmarks}
                    pagination={data.pagination}
                    filters={filters}
                    isLoading={isLoading || isPending}
                    canCreateBookmark={data.categories.length > 0}
                    onUpdateFilters={updateFilters}
                    onEdit={(bookmark: Bookmark) => setPanelMode({ type: 'bookmark', bookmark })}
                    onDelete={(bookmarkId) => requestDelete(bookmarkId, false)}
                    onCreateBookmark={() => setPanelMode({ type: 'bookmark' })}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* Modal Dialog Xác Nhận Xóa */}
      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        title={tCommon('messages.delete_confirm_title') || 'Confirm Delete'}
        description={
          deleteConfirmState.isCategory
            ? tBookmarks('actions.category_delete_confirm') || 'Are you sure you want to delete this category?'
            : tCommon('messages.delete_confirm') || 'Are you sure you want to delete this item?'
        }
        confirmLabel={tCommon('buttons.delete') || 'Delete'}
        cancelLabel={tCommon('buttons.cancel') || 'Cancel'}
        variant="destructive"
        isLoading={isPending}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
      />
    </main>
  );
}
