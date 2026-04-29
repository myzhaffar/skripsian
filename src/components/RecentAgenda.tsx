import { LogBimbingan, formatDateShort, truncate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Calendar, BookOpen } from 'lucide-react';

interface RecentAgendaProps {
  logs: LogBimbingan[];
}

export default function RecentAgenda({ logs }: RecentAgendaProps) {
  const recentLogs = logs.slice(0, 4);

  if (recentLogs.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Agenda Terbaru
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-surface-400 dark:text-surface-500">
          <BookOpen className="w-10 h-10 mb-3 opacity-50" />
          <p className="text-sm">Belum ada log bimbingan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
        Agenda Terbaru
      </h3>
      <div className="space-y-3">
        {recentLogs.map((log, index) => (
          <div
            key={log.id}
            className="flex items-start gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                  {log.babBahasan}
                </h4>
                <Badge status={log.statusBimbingan} />
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">
                {formatDateShort(log.tanggalBimbingan)}
              </p>
              {log.deskripsiProgres && (
                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
                  {truncate(log.deskripsiProgres, 100)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
