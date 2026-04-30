'use client';

import { useState, useEffect } from 'react';
import { Skripsi } from '@/lib/utils';
import { createSkripsi, updateSkripsi, USER_EMAIL } from '@/lib/supabase-queries';
import { useToast } from '@/app/providers';
import { Save, User } from 'lucide-react';

interface FormProfilProps {
  initialData?: Skripsi | null;
  onSuccess: () => void;
}

export default function FormProfil({ initialData, onSuccess }: FormProfilProps) {
  const { addToast } = useToast();
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    nim: initialData?.nim || '',
    namaMahasiswa: initialData?.namaMahasiswa || '',
    emailMahasiswa: USER_EMAIL,
    judulSkripsi: initialData?.judulSkripsi || '',
    dosenPembimbing: initialData?.dosenPembimbing || '',
    targetLulus: initialData?.targetLulus || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        nim: initialData.nim,
        namaMahasiswa: initialData.namaMahasiswa,
        emailMahasiswa: initialData.emailMahasiswa,
        judulSkripsi: initialData.judulSkripsi,
        dosenPembimbing: initialData.dosenPembimbing,
        targetLulus: initialData.targetLulus,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEdit && initialData) {
        await updateSkripsi(initialData.id, form);
        addToast('Profil berhasil diperbarui!', 'success');
      } else {
        await createSkripsi(form);
        addToast('Profil berhasil dibuat!', 'success');
      }
      onSuccess();
    } catch {
      addToast('Gagal menyimpan profil. Coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-secondary border-2 border-foreground shadow-[3px_3px_0px_0px_#1E293B] flex items-center justify-center">
          <User className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-foreground">
            Profil Skripsi
          </h1>
          <p className="text-sm text-muted-fg font-sans">
            {isEdit ? 'Perbarui informasi skripsi Anda' : 'Isi data skripsi untuk memulai'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-quaternary/5 border-2 border-foreground rounded-[16px] shadow-sticker-pink p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-text">NIM</label>
            <input
              type="text"
              className="input-field"
              placeholder="Masukkan NIM"
              value={form.nim}
              onChange={(e) => setForm({ ...form, nim: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-text">Nama Lengkap</label>
            <input
              type="text"
              className="input-field"
              placeholder="Masukkan nama lengkap"
              value={form.namaMahasiswa}
              onChange={(e) => setForm({ ...form, namaMahasiswa: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="label-text">Email</label>
          <input
            type="email"
            className="input-field !bg-muted cursor-not-allowed"
            value={form.emailMahasiswa}
            readOnly
          />
          <p className="mt-1.5 text-xs text-muted-fg font-sans">
            Email tidak bisa diubah pada Phase 1
          </p>
        </div>

        <div>
          <label className="label-text">Judul Skripsi</label>
          <textarea
            className="input-field min-h-[100px] resize-y"
            placeholder="Masukkan judul skripsi Anda"
            value={form.judulSkripsi}
            onChange={(e) => setForm({ ...form, judulSkripsi: e.target.value })}
            required
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-text">Dosen Pembimbing</label>
            <input
              type="text"
              className="input-field"
              placeholder="Nama dosen pembimbing"
              value={form.dosenPembimbing}
              onChange={(e) => setForm({ ...form, dosenPembimbing: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-text">Target Lulus</label>
            <input
              type="month"
              className="input-field"
              value={form.targetLulus}
              onChange={(e) => setForm({ ...form, targetLulus: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={isLoading}
          >
            <Save className="w-4 h-4" strokeWidth={2.5} />
            {isLoading ? 'Menyimpan...' : isEdit ? 'Perbarui Profil' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
}
