'use client';

import * as React from 'react';

export interface UsePaginationStateOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialStatusFilter?: string;
}

export function usePaginationState(options: UsePaginationStateOptions = {}) {
  const [page, setPage] = React.useState(options.initialPage ?? 1);
  const [pageSize, setPageSize] = React.useState(options.initialPageSize ?? 10);
  const [statusFilter, setStatusFilter] = React.useState(options.initialStatusFilter ?? '');
  const [totalPages, setTotalPages] = React.useState(1);

  const handleStatusFilterChange = React.useCallback((newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  }, []);

  const handlePageChange = React.useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    page,
    setPage: handlePageChange,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    totalPages,
    setTotalPages,
  };
}
