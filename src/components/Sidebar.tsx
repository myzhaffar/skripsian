'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  UserCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const quotes = [
  'Skripsi yang baik adalah skripsi yang selesai.',
  'Satu bab sehari, wisuda mendekat.',
  'Dosen pembimbing bukan musuh, tapi navigator.',
  'Revisi hari ini, ACC minggu depan.',
  'Mulai dulu, sempurnakan kemudian.',
  'Konsisten lebih penting dari sempurna.',
];

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/log', label: 'Log Bimbingan', icon: BookOpen },
  { href: '/profil', label: 'Profil', icon: UserCircle },
];

const navColors = ['bg-accent', 'bg-secondary', 'bg-quaternary'];

export default function Sidebar() {
  const pathname = usePathname();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[280px] lg:fixed lg:inset-y-0 lg:left-0 bg-card border-r-2 border-foreground z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b-2 border-border">
          <div className="w-11 h-11 rounded-full bg-accent border-2 border-foreground shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-heading font-extrabold text-foreground">
              Skripsi.an
            </h1>
            <p className="text-[11px] text-muted-fg font-heading font-semibold uppercase tracking-widest">
              Thesis Tracker
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-full text-sm font-heading font-bold transition-all duration-300 ease-bouncy',
                  active
                    ? 'bg-accent text-white border-2 border-foreground shadow-pop'
                    : 'text-foreground border-2 border-transparent hover:border-foreground hover:bg-muted'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2',
                  active
                    ? 'bg-white/20 border-white/30'
                    : `${navColors[i]}/20 border-transparent`
                )}>
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Quote */}
        {quote && (
          <div className="mx-4 mb-4 p-4 rounded-[16px] bg-tertiary/20 border-2 border-foreground shadow-sticker-yellow">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-heading font-bold text-foreground uppercase tracking-widest">
                Motivasi
              </span>
            </div>
            <p className="text-xs text-foreground/70 font-sans italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t-2 border-foreground z-40 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 ease-bouncy',
                  active
                    ? 'text-foreground'
                    : 'text-muted-fg'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-bouncy',
                  active
                    ? `${navColors[i]} border-foreground shadow-[2px_2px_0px_0px_#1E293B] text-white`
                    : 'border-transparent'
                )}>
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-heading font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
