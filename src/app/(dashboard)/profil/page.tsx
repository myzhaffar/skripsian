'use client';

import { useEffect, useState } from 'react';
import { Skripsi, apiFetch } from '@/lib/utils';
import FormProfil from '@/components/FormProfil';
import { Loader2 } from 'lucide-react';

export default function ProfilPage() {
  const [skripsi, setSkripsi] = useState<Skripsi | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSkripsi = async () => {
    try {
      const res = await apiFetch<Skripsi | null>('/api/skripsi');
      setSkripsi(res);
    } catch (err) {
      console.error('Failed to fetch skripsi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkripsi();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-sm text-surface-500 dark:text-surface-400">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <FormProfil
      initialData={skripsi}
      onSuccess={fetchSkripsi}
    />
  );
}
