'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/providers';
import { Chart, registerables } from 'chart.js';
import { LogBimbingan } from '@/lib/utils';

Chart.register(...registerables);

interface ActivityChartProps {
  logs: LogBimbingan[];
}

export default function ActivityChart({ logs }: ActivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Build last 30 days data
    const today = new Date();
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      labels.push(
        date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      );
      const count = logs.filter((log) => {
        const logDate = new Date(log.tanggalBimbingan).toISOString().split('T')[0];
        return logDate === dateStr;
      }).length;
      data.push(count);
    }

    const isDark = theme === 'dark';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sesi Bimbingan',
            data,
            borderColor: '#6366f1',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#6366f1',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#fff',
            titleColor: isDark ? '#f1f5f9' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#475569',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            titleFont: { size: 13, weight: 'bold' as const },
            bodyFont: { size: 12 },
            displayColors: false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} sesi`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: { size: 10 },
              maxTicksLimit: 10,
            },
            border: { display: false },
          },
          y: {
            min: 0,
            max: Math.max(3, Math.max(...data) + 1),
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 11 },
              stepSize: 1,
            },
            border: { display: false },
          },
        },
        animation: {
          duration: 1200,
          easing: 'easeOutQuart',
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [logs, theme]);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
        Aktivitas Bimbingan (30 Hari Terakhir)
      </h3>
      <div className="h-[280px]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
