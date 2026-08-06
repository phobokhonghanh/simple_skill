'use client';

import * as React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
  hideHeaderBorder?: boolean;
}

/**
 * Component Modal dùng chung bọc Backdrop, Transition, Header và nút Đóng an toàn.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-xl',
  hideHeaderBorder = false,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClass} bg-background border border-[var(--aff-border)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div
            className={`flex items-start justify-between p-5 ${
              hideHeaderBorder ? 'pb-1' : 'border-b border-[var(--aff-border)]'
            }`}
          >
            <div>
              {title && (
                <h3 className="font-extrabold text-base sm:text-lg text-[var(--aff-heading)]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[var(--aff-muted)] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-orange-500/10 text-[var(--aff-muted)] hover:text-[var(--aff-orange)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className={`px-5 sm:px-6 pb-5 sm:pb-6 max-h-[80vh] overflow-y-auto ${
            hideHeaderBorder && (title || subtitle) ? 'pt-1' : 'pt-5 sm:pt-6'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
