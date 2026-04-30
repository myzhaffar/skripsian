'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Skripsi, LogBimbingan, PaginatedResponse } from '@/lib/utils';
import { getSkripsi, getLogs, getAllLogs } from '@/lib/supabase-queries';
import LogTable from '@/components/LogTable';
import PrintArea from '@/components/PrintArea';
import { Loader2 } from 'lucide-react';

export default function LogPage() {
  const [skripsi, setSkripsi] = useState<Skripsi | null>(null);
  const [logData, setLogData] = useState<PaginatedResponse<LogBimbingan> | null>(null);
  const [allLogs, setAllLogs] = useState<LogBimbingan[]>([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const skripsiRes = await getSkripsi();
      setSkripsi(skripsiRes);

      if (skripsiRes) {
        const logRes = await getLogs(skripsiRes.id, 1, 15);
        setLogData(logRes);

        // Fetch all logs for print
        const all = await getAllLogs(skripsiRes.id);
        setAllLogs(all);
      }
    } catch (err) {
      console.error('Failed to fetch log data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary border-2 border-foreground shadow-pop flex items-center justify-center animate-bounce-subtle">
            <Loader2 className="w-6 h-6 text-white animate-spin" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-muted-fg font-heading font-semibold">Memuat log bimbingan...</p>
        </div>
      </div>
    );
  }

  if (!skripsi || !logData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-muted-fg font-heading font-semibold">
          Isi profil skripsi terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="no-print">
      <LogTable
        skripsiId={skripsi.id}
        initialData={logData}
        onRefresh={fetchData}
        onPrint={handlePrint}
      />

      {/* Print Area (hidden on screen) */}
      <PrintArea ref={printRef} skripsi={skripsi} logs={allLogs} />
    </div>
  );
}
