import { cn, StatusBimbingan } from '@/lib/utils';

const statusConfig: Record<StatusBimbingan, { label: string; className: string }> = {
  Menunggu: {
    label: 'Menunggu',
    className: 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300',
  },
  Revisi: {
    label: 'Revisi',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  ACC: {
    label: 'ACC',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
};

interface BadgeProps {
  status: StatusBimbingan;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
