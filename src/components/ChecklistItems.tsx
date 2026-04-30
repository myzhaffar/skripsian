'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getChecklistItems, toggleChecklist, USER_EMAIL } from '@/lib/supabase-queries';
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
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch checklist state from Supabase on mount
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const data = await getChecklistItems(logId);
        setChecked(data);
      } catch (err) {
        console.error('Failed to fetch checklist:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchChecklist();
  }, [logId]);

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-fg italic font-sans">
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
      await toggleChecklist(logId, index, newValue, USER_EMAIL);
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
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden border-2 border-foreground">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-bouncy"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-heading font-bold text-foreground whitespace-nowrap">
          {completedCount}/{items.length}
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <label
            key={index}
            className={cn(
              'flex items-start gap-3 p-3 rounded-[12px] cursor-pointer transition-all duration-300 ease-bouncy',
              'hover:bg-tertiary/10 border-2 border-transparent hover:border-border',
              checked[index] && 'opacity-60'
            )}
          >
            <button
              onClick={() => handleToggle(index)}
              disabled={loading[index] || initialLoading}
              className={cn(
                'flex-shrink-0 w-6 h-6 rounded-[6px] border-2 border-foreground flex items-center justify-center transition-all duration-300 ease-bouncy mt-0.5',
                checked[index]
                  ? 'bg-accent text-white shadow-[2px_2px_0px_0px_#1E293B]'
                  : 'bg-white hover:bg-accent/10'
              )}
            >
              {checked[index] && <Check className="w-4 h-4" strokeWidth={3} />}
            </button>
            <span
              className={cn(
                'text-sm text-foreground font-sans leading-relaxed',
                checked[index] && 'line-through text-muted-fg'
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
