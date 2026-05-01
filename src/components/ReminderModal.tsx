'use client';

import { useState, useEffect } from 'react';
import { Skripsi, LogBimbingan, daysRemaining, daysSince } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import {
  AlertTriangle,
  Clock,
  PartyPopper,
  Flame,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';



interface ReminderModalProps {
  skripsi: Skripsi;
  logs: LogBimbingan[];
}

type ReminderType = 'overdue' | 'deadline' | 'revisions' | 'ontrack';

interface ReminderContent {
  type: ReminderType;
  emoji: string;
  title: string;
  message: string;
  icon: typeof AlertTriangle;
  color: string; // accent bar color
  shadowClass: string;
  actionLabel?: string;
  actionHref?: string;
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0] || fullName;
}

function buildReminder(skripsi: Skripsi, logs: LogBimbingan[]): ReminderContent {
  const name = getFirstName(skripsi.namaMahasiswa);
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.tanggalBimbingan).getTime() - new Date(a.tanggalBimbingan).getTime()
  );

  const lastSessionDays = sortedLogs.length > 0 ? daysSince(sortedLogs[0].tanggalBimbingan) : 999;
  const targetDays = daysRemaining(skripsi.targetLulus);
  const pendingRevisions = logs.filter(
    (l) => l.statusBimbingan === 'Revisi'
  ).length;
  const pendingMenunggu = logs.filter(
    (l) => l.statusBimbingan === 'Menunggu'
  ).length;

  // Priority 1: No bimbingan in 14+ days
  if (lastSessionDays >= 14) {
    return {
      type: 'overdue',
      emoji: '😰',
      title: `Hi ${name}, sudah ${lastSessionDays} hari tanpa bimbingan!`,
      message: `Terakhir bimbingan ${lastSessionDays} hari yang lalu. Segera jadwalkan pertemuan dengan dosen pembimbing supaya progres tetap jalan.`,
      icon: AlertTriangle,
      color: 'bg-red-500',
      shadowClass: 'shadow-[6px_6px_0px_0px_#EF4444]',
      actionLabel: 'Catat Bimbingan',
      actionHref: '/log',
    };
  }

  // Priority 2: Target lulus < 30 days
  if (targetDays > 0 && targetDays <= 30) {
    return {
      type: 'deadline',
      emoji: '🔥',
      title: `Hi ${name}, tinggal ${targetDays} hari!`,
      message: `Deadline semakin dekat. Pastikan semua bab sudah ACC dan persiapan sidang berjalan lancar. Kamu pasti bisa!`,
      icon: Flame,
      color: 'bg-secondary',
      shadowClass: 'shadow-[6px_6px_0px_0px_#F472B6]',
      actionLabel: 'Cek Progres',
      actionHref: '/',
    };
  }

  // Priority 3: Has pending revisions
  if (pendingRevisions > 0) {
    return {
      type: 'revisions',
      emoji: '📝',
      title: `Hi ${name}, ada ${pendingRevisions} revisi!`,
      message: `${pendingRevisions} catatan revisi dari dosen belum diselesaikan${pendingMenunggu > 0 ? ` dan ${pendingMenunggu} bimbingan menunggu review` : ''}. Yuk, kerjakan satu per satu!`,
      icon: BookOpen,
      color: 'bg-tertiary',
      shadowClass: 'shadow-[6px_6px_0px_0px_#FBBF24]',
      actionLabel: 'Lihat Revisi',
      actionHref: '/log',
    };
  }

  // Priority 4: Everything is on track!
  return {
    type: 'ontrack',
    emoji: '🎉',
    title: `Hi ${name}, progres bagus!`,
    message: targetDays <= 0
      ? 'Target sudah tercapai! Semoga sidangnya sukses dan lancar. Kamu hebat! 🎓'
      : `Semuanya on track! Target sidang tinggal ${targetDays} hari lagi. Pertahankan momentum ini!`,
    icon: targetDays <= 0 ? PartyPopper : CheckCircle2,
    color: 'bg-quaternary',
    shadowClass: 'shadow-[6px_6px_0px_0px_#34D399]',
  };
}



export default function ReminderModal({ skripsi, logs }: ReminderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reminder, setReminder] = useState<ReminderContent | null>(null);

  useEffect(() => {
    const content = buildReminder(skripsi, logs);
    setReminder(content);

    // Small delay so the dashboard loads first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [skripsi, logs]);

  if (!reminder || !isOpen) return null;

  const Icon = reminder.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/30 animate-fade-in" />

      {/* Card */}
      <div
        className={`relative w-full max-w-md bg-card border-2 border-foreground rounded-[16px] ${reminder.shadowClass} animate-pop-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className={`h-2 ${reminder.color} rounded-t-[14px]`} />

        <div className="px-6 py-6">
          {/* Icon + Emoji */}
          <div className="flex flex-col items-center text-center mb-5">
            <div
              className={`w-16 h-16 rounded-full ${reminder.color} border-2 border-foreground flex items-center justify-center mb-3 shadow-pop`}
            >
              <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-foreground">
              {reminder.emoji} {reminder.title}
            </h2>
          </div>

          {/* Message */}
          <p className="text-sm text-foreground/70 font-sans leading-relaxed text-center mb-6">
            {reminder.message}
          </p>

          {/* Stats summary */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent/10 border-2 border-foreground text-xs font-heading font-bold">
              <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
              {daysRemaining(skripsi.targetLulus) > 0
                ? `${daysRemaining(skripsi.targetLulus)} hari lagi`
                : 'Target tercapai'}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-tertiary/10 border-2 border-foreground text-xs font-heading font-bold">
              <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} />
              {logs.length} sesi
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="btn-secondary flex-1 !py-2.5 text-sm"
            >
              Tutup
            </button>
            {reminder.actionLabel && reminder.actionHref && (
              <Link
                href={reminder.actionHref}
                onClick={() => setIsOpen(false)}
                className="btn-primary flex-1 !py-2.5 text-sm text-center"
              >
                {reminder.actionLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
