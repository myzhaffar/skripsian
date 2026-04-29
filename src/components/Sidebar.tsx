'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/providers';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  UserCircle,
  GraduationCap,
  Sun,
  Moon,
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

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
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
      <aside className="hidden lg:flex lg:flex-col lg:w-[280px] lg:fixed lg:inset-y-0 lg:left-0 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-surface-100 dark:border-surface-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Skripsi.an
            </h1>
            <p className="text-[11px] text-surface-400 dark:text-surface-500 font-medium">
              Thesis Tracker
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'text-brand-500')} />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quote */}
        {quote && (
          <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 border border-brand-100 dark:border-brand-900/30">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Motivasi
              </span>
            </div>
            <p className="text-xs text-surface-600 dark:text-surface-400 italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="px-4 py-4 border-t border-surface-100 dark:border-surface-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-brand-500" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-t border-surface-200 dark:border-surface-800 z-40 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                  active
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-surface-400 dark:text-surface-500'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && (
                  <div className="w-4 h-0.5 rounded-full bg-brand-500" />
                )}
              </Link>
            );
          })}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-surface-400 dark:text-surface-500"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="text-[10px] font-medium">Tema</span>
          </button>
        </div>
      </nav>
    </>
  );
}
