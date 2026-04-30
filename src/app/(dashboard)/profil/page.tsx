'use client';

import { useEffect, useState } from 'react';
import { Skripsi } from '@/lib/utils';
import { getSkripsi } from '@/lib/supabase-queries';
import FormProfil from '@/components/FormProfil';
import { Loader2 } from 'lucide-react';

export default function ProfilPage() {
  const [skripsi, setSkripsi] = useState<Skripsi | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSkripsi = async () => {
    try {
      const res = await getSkripsi();
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
          <div className="w-12 h-12 rounded-full bg-quaternary border-2 border-foreground shadow-pop flex items-center justify-center animate-bounce-subtle">
            <Loader2 className="w-6 h-6 text-white animate-spin" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-muted-fg font-heading font-semibold">Memuat profil...</p>
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
