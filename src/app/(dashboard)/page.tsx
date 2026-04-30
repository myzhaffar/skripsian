'use client';

import { useEffect, useState } from 'react';
import { Skripsi, LogBimbingan, daysSince } from '@/lib/utils';
import { getSkripsi, getAllLogs } from '@/lib/supabase-queries';
import CountdownBanner from '@/components/CountdownBanner';
import StatCard from '@/components/StatCard';
import ActivityChart from '@/components/ActivityChart';
import RecentAgenda from '@/components/RecentAgenda';
import { BookOpen, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [skripsi, setSkripsi] = useState<Skripsi | null>(null);
  const [logs, setLogs] = useState<LogBimbingan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skripsiRes = await getSkripsi();
        setSkripsi(skripsiRes);

        if (skripsiRes) {
          const allLogs = await getAllLogs(skripsiRes.id);
          setLogs(allLogs);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent border-2 border-foreground shadow-pop flex items-center justify-center animate-bounce-subtle">
            <Loader2 className="w-6 h-6 text-white animate-spin" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-muted-fg font-heading font-semibold">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!skripsi) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-tertiary border-2 border-foreground shadow-sticker-yellow flex items-center justify-center mb-4 animate-pop-in">
          <BookOpen className="w-10 h-10 text-foreground" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-heading font-extrabold text-foreground mb-2">
          Selamat Datang di Skripsi.an! 🎓
        </h2>
        <p className="text-muted-fg font-sans mb-6 max-w-md">
          Mulai dengan mengisi profil skripsi Anda terlebih dahulu untuk melacak progres bimbingan.
        </p>
        <Link href="/profil" className="btn-primary">
          Isi Profil Skripsi
        </Link>
      </div>
    );
  }

  const totalSessions = logs.length;
  const pendingCount = logs.filter(
    (l) => l.statusBimbingan === 'Menunggu' || l.statusBimbingan === 'Revisi'
  ).length;
  const accCount = logs.filter((l) => l.statusBimbingan === 'ACC').length;

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.tanggalBimbingan).getTime() - new Date(a.tanggalBimbingan).getTime()
  );
  const lastSessionDays = sortedLogs.length > 0 ? daysSince(sortedLogs[0].tanggalBimbingan) : 0;

  const getWeeklyData = (filterFn: (l: LogBimbingan) => boolean) => {
    const now = new Date();
    const weeks: number[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (w + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      const count = logs.filter((l) => {
        const d = new Date(l.tanggalBimbingan);
        return d >= weekStart && d < weekEnd && filterFn(l);
      }).length;
      weeks.push(count);
    }
    return weeks;
  };

  const sessionSparkline = getWeeklyData(() => true);
  const pendingSparkline = getWeeklyData(
    (l) => l.statusBimbingan === 'Menunggu' || l.statusBimbingan === 'Revisi'
  );
  const accSparkline = (() => {
    const now = new Date();
    const data: number[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      const count = logs.filter((l) => {
        const d = new Date(l.tanggalBimbingan);
        return d <= weekEnd && l.statusBimbingan === 'ACC';
      }).length;
      data.push(count);
    }
    return data;
  })();

  return (
    <div className="space-y-6">
      <CountdownBanner targetLulus={skripsi.targetLulus} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sesi"
          value={totalSessions}
          icon={<BookOpen className="w-5 h-5" strokeWidth={2.5} />}
          sparklineData={sessionSparkline}
          delay={0}
        />
        <StatCard
          title="Revisi Pending"
          value={pendingCount}
          icon={<AlertCircle className="w-5 h-5" strokeWidth={2.5} />}
          sparklineData={pendingSparkline}
          delay={1}
        />
        <StatCard
          title="Bab ACC"
          value={accCount}
          icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
          sparklineData={accSparkline}
          delay={2}
        />
        <StatCard
          title="Hari Terakhir"
          value={sortedLogs.length > 0 ? lastSessionDays : '-'}
          icon={<Clock className="w-5 h-5" strokeWidth={2.5} />}
          delay={3}
          badge={
            sortedLogs.length > 0 ? (
              lastSessionDays <= 7 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-heading font-bold border-2 border-foreground bg-quaternary text-foreground shadow-[2px_2px_0px_0px_#059669]">
                  🔥 On Fire!
                </span>
              ) : lastSessionDays > 14 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-heading font-bold border-2 border-foreground bg-secondary text-foreground shadow-[2px_2px_0px_0px_#BE185D]">
                  ⚠️ Awas Dicoret
                </span>
              ) : null
            ) : null
          }
        />
      </div>

      <ActivityChart logs={logs} />
      <RecentAgenda logs={sortedLogs} />
    </div>
  );
}
