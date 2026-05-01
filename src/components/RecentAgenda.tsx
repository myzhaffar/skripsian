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
      <div className="bg-tertiary/10 border-2 border-foreground rounded-[16px] p-6 shadow-sticker-yellow animate-fade-in">
        <h3 className="text-sm font-heading font-bold text-foreground mb-4 uppercase tracking-wider">
          Agenda Terbaru
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-fg">
          <div className="w-14 h-14 rounded-full bg-muted border-2 border-foreground flex items-center justify-center mb-3">
            <BookOpen className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-heading font-semibold">Belum ada log bimbingan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tertiary/10 border-2 border-foreground rounded-[16px] p-6 shadow-sticker-yellow animate-fade-in">
      <h3 className="text-sm font-heading font-bold text-foreground mb-4 uppercase tracking-wider">
        Agenda Terbaru
      </h3>
      <div className="space-y-3">
        {recentLogs.map((log, index) => (
          <div
            key={log.id}
            className="flex items-start gap-4 p-4 rounded-[12px] bg-background border-2 border-foreground hover:shadow-pop transition-all duration-300 ease-bouncy animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center text-white bg-accent">
              <Calendar className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-heading font-bold text-foreground truncate">
                  {log.babBahasan}
                </h4>
                <Badge status={log.statusBimbingan} />
              </div>
              <p className="text-xs text-muted-fg font-sans mb-1">
                {formatDateShort(log.tanggalBimbingan)}
              </p>
              {log.deskripsiProgres && (
                <p className="text-xs text-foreground/60 font-sans leading-relaxed">
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
