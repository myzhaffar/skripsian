'use client';

import { cn, daysRemaining } from '@/lib/utils';
import { GraduationCap, Clock, AlertTriangle, PartyPopper } from 'lucide-react';

interface CountdownBannerProps {
  targetLulus: string; // YYYY-MM
}

export default function CountdownBanner({ targetLulus }: CountdownBannerProps) {
  const days = daysRemaining(targetLulus);

  let colorClasses: string;
  let bgGradient: string;
  let Icon = GraduationCap;
  let emoji = '🎓';

  if (days <= 0) {
    colorClasses = 'text-white';
    bgGradient = 'from-emerald-500 to-teal-600';
    Icon = PartyPopper;
    emoji = '🎉';
  } else if (days > 60) {
    colorClasses = 'text-white';
    bgGradient = 'from-emerald-500 to-emerald-700';
  } else if (days >= 30) {
    colorClasses = 'text-white';
    bgGradient = 'from-amber-500 to-orange-600';
    Icon = Clock;
    emoji = '⏰';
  } else {
    colorClasses = 'text-white';
    bgGradient = 'from-red-500 to-rose-700';
    Icon = AlertTriangle;
    emoji = '🔥';
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r shadow-lg animate-fade-in',
        bgGradient,
        colorClasses
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            {days <= 0 ? (
              <>
                <h2 className="text-2xl font-bold">Waktunya Sidang! {emoji}</h2>
                <p className="text-sm opacity-90 mt-1">
                  Target lulus sudah tercapai. Semangat sidangnya!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">
                  {days} hari lagi menuju sidang {emoji}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  Target: {new Date(targetLulus + '-01').toLocaleDateString('id-ID', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-4xl font-bold opacity-20">
          <span>{Math.abs(days)}</span>
        </div>
      </div>
    </div>
  );
}
