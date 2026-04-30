'use client';

import { cn, daysRemaining } from '@/lib/utils';
import { GraduationCap, Clock, AlertTriangle, PartyPopper } from 'lucide-react';

interface CountdownBannerProps {
  targetLulus: string; // YYYY-MM
}

export default function CountdownBanner({ targetLulus }: CountdownBannerProps) {
  const days = daysRemaining(targetLulus);

  let bgColor: string;
  let shadowColor: string;
  let Icon = GraduationCap;
  let emoji = '🎓';
  let iconBg = 'bg-quaternary';

  if (days <= 0) {
    bgColor = 'bg-quaternary';
    shadowColor = 'shadow-[6px_6px_0px_0px_#059669]';
    Icon = PartyPopper;
    emoji = '🎉';
    iconBg = 'bg-white/30';
  } else if (days > 60) {
    bgColor = 'bg-quaternary';
    shadowColor = 'shadow-[6px_6px_0px_0px_#059669]';
    iconBg = 'bg-white/30';
  } else if (days >= 30) {
    bgColor = 'bg-tertiary';
    shadowColor = 'shadow-[6px_6px_0px_0px_#D97706]';
    Icon = Clock;
    emoji = '⏰';
    iconBg = 'bg-white/30';
  } else {
    bgColor = 'bg-secondary';
    shadowColor = 'shadow-[6px_6px_0px_0px_#BE185D]';
    Icon = AlertTriangle;
    emoji = '🔥';
    iconBg = 'bg-white/30';
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[16px] p-6 border-2 border-foreground animate-pop-in',
        bgColor,
        shadowColor
      )}
    >
      {/* Decorative shapes */}
      <div className="absolute top-3 right-4 w-12 h-12 rounded-full border-2 border-foreground/20 bg-white/10" />
      <div className="absolute bottom-2 right-20 w-6 h-6 rotate-45 border-2 border-foreground/20 bg-white/10" />
      <div className="absolute top-1 right-24 w-4 h-4 rounded-full bg-white/15" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn('w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center', iconBg)}>
            <Icon className="w-7 h-7 text-foreground" strokeWidth={2.5} />
          </div>
          <div>
            {days <= 0 ? (
              <>
                <h2 className="text-2xl font-heading font-extrabold text-foreground">Waktunya Sidang! {emoji}</h2>
                <p className="text-sm text-foreground/70 font-sans mt-1">
                  Target lulus sudah tercapai. Semangat sidangnya!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-heading font-extrabold text-foreground">
                  {days} hari lagi menuju sidang {emoji}
                </h2>
                <p className="text-sm text-foreground/70 font-sans mt-1">
                  Target: {new Date(targetLulus + '-01').toLocaleDateString('id-ID', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center">
          <span className="text-5xl font-heading font-extrabold text-foreground/15">
            {Math.abs(days)}
          </span>
        </div>
      </div>
    </div>
  );
}
