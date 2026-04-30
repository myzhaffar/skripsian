'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const cardColors = [
  { icon: 'bg-accent', shadow: 'shadow-sticker-violet', bg: 'bg-accent/10' },
  { icon: 'bg-secondary', shadow: 'shadow-sticker-pink', bg: 'bg-secondary/10' },
  { icon: 'bg-quaternary', shadow: 'shadow-sticker-mint', bg: 'bg-quaternary/10' },
  { icon: 'bg-tertiary', shadow: 'shadow-sticker-yellow', bg: 'bg-tertiary/10' },
];

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
  const colorSet = cardColors[delay % cardColors.length];

  useEffect(() => {
    if (!sparklineData || !canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 30);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sparklineData.map((_, i) => i.toString()),
        datasets: [
          {
            data: sparklineData,
            borderColor: '#8B5CF6',
            borderWidth: 2.5,
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
      className={`${colorSet.bg} border-2 border-foreground rounded-[16px] p-5 ${colorSet.shadow} animate-pop-in transition-all duration-300 ease-bouncy hover:rotate-[-1deg] hover:scale-[1.02]`}
      style={{ animationDelay: `${delay * 80}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-heading font-bold text-muted-fg uppercase tracking-widest">
            {title}
          </p>
          <p className="text-3xl font-heading font-extrabold text-foreground mt-2">
            {value}
          </p>
          {badge && <div className="mt-2">{badge}</div>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center text-white ${colorSet.icon}`}>
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
