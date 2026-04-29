'use client';

import { useState } from 'react';
import { LogBimbingan, StatusBimbingan, apiFetch } from '@/lib/utils';
import { useToast } from '@/app/providers';
import Modal from '@/components/ui/Modal';

interface FormLogProps {
  isOpen: boolean;
  onClose: () => void;
  skripsiId: string;
  editingLog?: LogBimbingan | null;
  onSuccess: () => void;
}

export default function FormLog({
  isOpen,
  onClose,
  skripsiId,
  editingLog,
  onSuccess,
}: FormLogProps) {
  const { addToast } = useToast();
  const isEdit = !!editingLog;

  const [form, setForm] = useState({
    tanggalBimbingan: editingLog?.tanggalBimbingan?.split('T')[0] || new Date().toISOString().split('T')[0],
    babBahasan: editingLog?.babBahasan || '',
    deskripsiProgres: editingLog?.deskripsiProgres || '',
    catatanDosen: editingLog?.catatanDosen || '',
    statusBimbingan: (editingLog?.statusBimbingan || 'Menunggu') as StatusBimbingan,
    linkFile: editingLog?.linkFile || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when editingLog changes
  useState(() => {
    if (editingLog) {
      setForm({
        tanggalBimbingan: editingLog.tanggalBimbingan?.split('T')[0] || '',
        babBahasan: editingLog.babBahasan || '',
        deskripsiProgres: editingLog.deskripsiProgres || '',
        catatanDosen: editingLog.catatanDosen || '',
        statusBimbingan: editingLog.statusBimbingan || 'Menunggu',
        linkFile: editingLog.linkFile || '',
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEdit && editingLog) {
        await apiFetch(`/api/log/${editingLog.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        addToast('Log berhasil diperbarui!', 'success');
      } else {
        await apiFetch('/api/log', {
          method: 'POST',
          body: JSON.stringify({
            skripsiId,
            ...form,
          }),
        });
        addToast('Log bimbingan berhasil ditambahkan!', 'success');
      }
      onSuccess();
      onClose();
    } catch {
      addToast('Gagal menyimpan log. Coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Log Bimbingan' : 'Tambah Bimbingan Baru'}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Tanggal Bimbingan</label>
          <input
            type="date"
            className="input-field"
            value={form.tanggalBimbingan}
            onChange={(e) => setForm({ ...form, tanggalBimbingan: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label-text">Bab / Topik Bahasan</label>
          <input
            type="text"
            className="input-field"
            placeholder="contoh: Bab 1 - Pendahuluan"
            value={form.babBahasan}
            onChange={(e) => setForm({ ...form, babBahasan: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label-text">Deskripsi Progres</label>
          <textarea
            className="input-field min-h-[80px] resize-y"
            placeholder="Deskripsikan progres yang dibahas..."
            value={form.deskripsiProgres}
            onChange={(e) => setForm({ ...form, deskripsiProgres: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <label className="label-text">Catatan Dosen (satu per baris)</label>
          <textarea
            className="input-field min-h-[80px] resize-y"
            placeholder="Catatan 1&#10;Catatan 2&#10;Catatan 3"
            value={form.catatanDosen}
            onChange={(e) => setForm({ ...form, catatanDosen: e.target.value })}
            rows={3}
          />
          <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">
            Setiap baris akan menjadi checklist item
          </p>
        </div>

        <div>
          <label className="label-text">Status</label>
          <select
            className="input-field"
            value={form.statusBimbingan}
            onChange={(e) => setForm({ ...form, statusBimbingan: e.target.value as StatusBimbingan })}
          >
            <option value="Menunggu">Menunggu</option>
            <option value="Revisi">Revisi</option>
            <option value="ACC">ACC</option>
          </select>
        </div>

        <div>
          <label className="label-text">Link File (opsional)</label>
          <input
            type="url"
            className="input-field"
            placeholder="https://drive.google.com/..."
            value={form.linkFile}
            onChange={(e) => setForm({ ...form, linkFile: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
