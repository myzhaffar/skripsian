'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Hapus',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-14 h-14 rounded-full bg-red-100 border-2 border-foreground shadow-[3px_3px_0px_0px_#EF4444] flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" strokeWidth={2.5} />
        </div>
        <p className="text-foreground/70 mb-6 font-sans">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Menghapus...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
