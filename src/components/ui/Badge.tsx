import { cn, StatusBimbingan } from '@/lib/utils';

const statusConfig: Record<StatusBimbingan, { label: string; bg: string; shadow: string }> = {
  Menunggu: {
    label: 'Menunggu',
    bg: 'bg-muted text-foreground',
    shadow: 'shadow-[3px_3px_0px_0px_#CBD5E1]',
  },
  Revisi: {
    label: 'Revisi',
    bg: 'bg-tertiary text-foreground',
    shadow: 'shadow-[3px_3px_0px_0px_#D97706]',
  },
  ACC: {
    label: 'ACC',
    bg: 'bg-quaternary text-foreground',
    shadow: 'shadow-[3px_3px_0px_0px_#059669]',
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
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider border-2 border-foreground',
        config.bg,
        config.shadow,
        className
      )}
    >
      {config.label}
    </span>
  );
}
