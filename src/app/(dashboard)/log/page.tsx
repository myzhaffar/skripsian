'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Skripsi, LogBimbingan, PaginatedResponse, apiFetch } from '@/lib/utils';
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
      const [skripsiRes, logRes] = await Promise.all([
        apiFetch<Skripsi | null>('/api/skripsi'),
        apiFetch<PaginatedResponse<LogBimbingan>>('/api/log?page=1&limit=15'),
      ]);
      setSkripsi(skripsiRes);
      setLogData(logRes);

      // Fetch all logs for print
      if (logRes.total > 15) {
        const allRes = await apiFetch<PaginatedResponse<LogBimbingan>>(
          `/api/log?page=1&limit=${logRes.total}`
        );
        setAllLogs(allRes.data);
      } else {
        setAllLogs(logRes.data);
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
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-sm text-surface-500 dark:text-surface-400">Memuat log bimbingan...</p>
        </div>
      </div>
    );
  }

  if (!skripsi || !logData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-surface-500 dark:text-surface-400">
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
