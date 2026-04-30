'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { LogBimbingan } from '@/lib/utils';

Chart.register(...registerables);

interface ActivityChartProps {
  logs: LogBimbingan[];
}

export default function ActivityChart({ logs }: ActivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

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

    const gridColor = 'rgba(148, 163, 184, 0.15)';
    const textColor = '#64748B';

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sesi Bimbingan',
            data,
            borderColor: '#8B5CF6',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#8B5CF6',
            pointHoverBorderColor: '#1E293B',
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
            backgroundColor: '#FFFFFF',
            titleColor: '#1E293B',
            bodyColor: '#64748B',
            borderColor: '#1E293B',
            borderWidth: 2,
            cornerRadius: 12,
            padding: 12,
            titleFont: { size: 13, weight: 'bold' as const, family: 'Outfit' },
            bodyFont: { size: 12, family: 'Plus Jakarta Sans' },
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
              font: { size: 10, family: 'Plus Jakarta Sans' },
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
              font: { size: 11, family: 'Plus Jakarta Sans' },
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
  }, [logs]);

  return (
    <div className="bg-accent/5 border-2 border-foreground rounded-[16px] p-6 shadow-sticker-violet animate-fade-in">
      <h3 className="text-sm font-heading font-bold text-foreground mb-4 uppercase tracking-wider">
        Aktivitas Bimbingan (30 Hari Terakhir)
      </h3>
      <div className="h-[280px]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
