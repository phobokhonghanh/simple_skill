'use client';

import * as React from 'react';
import { FilterBar } from './FilterBar';

export interface DateFilterProps {
  startDate: string;
  endDate: string;
  onSearch: (startDate: string, endDate: string) => void;
  loading?: boolean;
  className?: string;
}

/**
 * Component bộ lọc khoảng thời gian bọc lại FilterBar để tái sử dụng logic giao diện tập trung.
 */
export function DateFilter({
  startDate,
  endDate,
  onSearch,
  loading = false,
  className = '',
}: DateFilterProps) {
  const [tempStart, setTempStart] = React.useState(startDate);
  const [tempEnd, setTempEnd] = React.useState(endDate);
  const [prevStart, setPrevStart] = React.useState(startDate);
  const [prevEnd, setPrevEnd] = React.useState(endDate);

  if (prevStart !== startDate || prevEnd !== endDate) {
    setPrevStart(startDate);
    setPrevEnd(endDate);
    setTempStart(startDate);
    setTempEnd(endDate);
  }

  const handleSearch = () => {
    onSearch(tempStart, tempEnd);
  };

  return (
    <FilterBar
      startDate={tempStart}
      onStartDateChange={setTempStart}
      endDate={tempEnd}
      onEndDateChange={setTempEnd}
      onSearch={handleSearch}
      loading={loading}
      className={className}
    />
  );
}
