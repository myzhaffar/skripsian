'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  sparklineData?: number[];
  badge?: ReactNode;
  delay?: number;
}

export default function StatCard({ title, value, icon, sparklineData, badge, delay = 0 }: StatCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!sparklineData || !canvasRef.current) return;

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 30);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sparklineData.map((_, i) => i.toString()),
        datasets: [
          {
            data: sparklineData,
            borderColor: '#6366f1',
            borderWidth: 2,
            fill: true,
            backgroundColor: gradient,
            pointRadius: 0,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        animation: {
          duration: 800,
          delay: delay * 100,
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [sparklineData, delay]);

  return (
    <div
      className="glass-card p-5 animate-slide-up"
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 mt-2">
            {value}
          </p>
          {badge && <div className="mt-2">{badge}</div>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-500">
            {icon}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <canvas ref={canvasRef} width={70} height={30} className="mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}
