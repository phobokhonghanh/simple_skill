'use client';

import * as React from 'react';
import Image from 'next/image';
import { Search, ChevronDown, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Bank } from '@/features/cashback/types';

interface BankSelectProps {
  banks: Bank[];
  value: string;
  onChange: (bankCode: string) => void;
  disabled?: boolean;
  className?: string;
}

export function BankSelect({
  banks,
  value,
  onChange,
  disabled = false,
  className = '',
}: BankSelectProps) {
  const t = useTranslations('cashback.payment');
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedBank = React.useMemo(
    () => banks.find((b) => b.code.toUpperCase() === value.toUpperCase()),
    [banks, value],
  );

  const filteredBanks = React.useMemo(() => {
    if (!searchQuery.trim()) return banks;
    const q = searchQuery.toLowerCase().trim();
    return banks.filter(
      (b) =>
        b.code.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        (b.shortName && b.shortName.toLowerCase().includes(q)),
    );
  }, [banks, searchQuery]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="aff-input w-full min-h-[52px] sm:min-h-[56px] px-3 sm:px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm bg-[var(--aff-surface)] text-[var(--aff-text)] border-[var(--aff-border)]"
      >
        {selectedBank ? (
          <div className="flex items-center gap-2.5 min-w-0 flex-1 py-0.5">
            {selectedBank.logo && (
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg overflow-hidden bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center">
                <Image
                  src={selectedBank.logo}
                  alt={selectedBank.code}
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            )}
            <span className="font-bold text-[var(--aff-orange)] shrink-0 px-2 py-0.5 rounded-md bg-orange-500/10 text-[11px] sm:text-xs">
              {selectedBank.code}
            </span>
            <span className="font-medium text-[var(--aff-text)] leading-snug break-words whitespace-normal text-xs sm:text-sm">
              {selectedBank.name}
            </span>
          </div>
        ) : (
          <span className="text-[var(--aff-muted)] font-normal">
            {t('select_bank')}
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-[var(--aff-muted)] shrink-0 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-[var(--aff-surface)] border border-[var(--aff-border)] rounded-2xl shadow-2xl p-2 max-h-80 overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--aff-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_bank_placeholder')}
              className="aff-input w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl text-xs bg-[var(--aff-surface)] text-[var(--aff-text)]"
              autoFocus
            />
          </div>

          {/* Bank List */}
          <div className="overflow-y-auto space-y-1.5 max-h-64 pr-1 scrollbar-thin">
            {filteredBanks.length === 0 ? (
              <div className="p-3 text-center text-xs text-[var(--aff-muted)]">
                {t('no_bank_found')}
              </div>
            ) : (
              filteredBanks.map((bank) => {
                const isSelected =
                  bank.code.toUpperCase() === value.toUpperCase();
                return (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => {
                      onChange(bank.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-2.5 sm:px-3 py-2.5 rounded-xl text-left transition-colors text-xs sm:text-sm cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/10 text-[var(--aff-orange)] font-bold border border-orange-500/20'
                        : 'hover:bg-[var(--aff-history-item-hover)] text-[var(--aff-text)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {bank.logo && (
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg overflow-hidden bg-white p-1 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center">
                          <Image
                            src={bank.logo}
                            alt={bank.code}
                            width={32}
                            height={32}
                            className="object-contain w-full h-full"
                            unoptimized
                          />
                        </div>
                      )}
                      <span className="font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] sm:text-xs shrink-0">
                        {bank.code}
                      </span>
                      <span className="leading-snug break-words whitespace-normal font-medium text-xs sm:text-sm text-[var(--aff-text)]">
                        {bank.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--aff-orange)] shrink-0 ml-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
