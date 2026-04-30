'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    // Focus trap
    const focusableElements = contentRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements?.length) {
      (focusableElements[0] as HTMLElement).focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/30 animate-fade-in" />

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          'relative w-full max-w-lg bg-card border-2 border-foreground rounded-[16px] shadow-pop animate-pop-in',
          'max-h-[90vh] flex flex-col',
          className
        )}
      >
        {/* Accent bar */}
        <div className="h-2 bg-accent rounded-t-[14px]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-border">
          <h2 className="text-lg font-heading font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center hover:bg-tertiary transition-all duration-300 ease-bouncy"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-foreground" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
