'use client';

import { useState } from 'react';
import { cn, apiFetch, USER_EMAIL } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ChecklistItemsProps {
  logId: string;
  catatanDosen: string;
  initialChecked?: Record<number, boolean>;
}

export default function ChecklistItems({
  logId,
  catatanDosen,
  initialChecked = {},
}: ChecklistItemsProps) {
  const items = catatanDosen
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const [checked, setChecked] = useState<Record<number, boolean>>(initialChecked);
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  if (items.length === 0) {
    return (
      <p className="text-sm text-surface-400 dark:text-surface-500 italic">
        Tidak ada catatan dosen
      </p>
    );
  }

  const handleToggle = async (index: number) => {
    const newValue = !checked[index];

    // Optimistic update
    setChecked((prev) => ({ ...prev, [index]: newValue }));
    setLoading((prev) => ({ ...prev, [index]: true }));

    try {
      await apiFetch(`/api/checklist/${logId}/${index}`, {
        method: 'PUT',
        body: JSON.stringify({
          isChecked: newValue,
          userEmail: USER_EMAIL,
        }),
      });
    } catch {
      // Revert on error
      setChecked((prev) => ({ ...prev, [index]: !newValue }));
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 whitespace-nowrap">
          {completedCount}/{items.length}
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <label
            key={index}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200',
              'hover:bg-surface-50 dark:hover:bg-surface-700/50',
              checked[index] && 'opacity-60'
            )}
          >
            <button
              onClick={() => handleToggle(index)}
              disabled={loading[index]}
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 mt-0.5',
                checked[index]
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-surface-300 dark:border-surface-600 hover:border-brand-400'
              )}
            >
              {checked[index] && <Check className="w-3 h-3" />}
            </button>
            <span
              className={cn(
                'text-sm text-surface-700 dark:text-surface-300 leading-relaxed',
                checked[index] && 'line-through text-surface-400 dark:text-surface-500'
              )}
            >
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
