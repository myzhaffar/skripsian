'use client';

import { useToast } from '@/app/providers';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'bg-white',
    shadow: 'shadow-[4px_4px_0px_0px_#34D399]',
    icon: 'text-emerald-700',
  },
  error: {
    bg: 'bg-white',
    shadow: 'shadow-[4px_4px_0px_0px_#EF4444]',
    icon: 'text-red-700',
  },
  info: {
    bg: 'bg-white',
    shadow: 'shadow-[4px_4px_0px_0px_#8B5CF6]',
    icon: 'text-accent',
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        const colors = colorMap[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-full border-2 border-foreground animate-slide-in-right min-w-[280px] max-w-[400px]',
              colors.bg,
              colors.shadow
            )}
          >
            <div className={cn('w-7 h-7 rounded-full border-2 border-foreground flex items-center justify-center flex-shrink-0', toast.type === 'success' ? 'bg-quaternary' : toast.type === 'error' ? 'bg-red-400' : 'bg-accent')}>
              <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-heading font-semibold text-foreground flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-foreground/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-foreground" strokeWidth={2.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
