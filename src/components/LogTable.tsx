'use client';

import { useState } from 'react';
import {
  LogBimbingan,
  PaginatedResponse,
  formatDateShort,
  truncate,
  apiFetch,
} from '@/lib/utils';
import { useToast } from '@/app/providers';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ChecklistItems from '@/components/ChecklistItems';
import FormLog from '@/components/FormLog';
import {
  Plus,
  Download,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Printer,
  ExternalLink,
} from 'lucide-react';

interface LogTableProps {
  skripsiId: string;
  initialData: PaginatedResponse<LogBimbingan>;
  onRefresh: () => void;
  onPrint: () => void;
}

export default function LogTable({ skripsiId, initialData, onRefresh, onPrint }: LogTableProps) {
  const { addToast } = useToast();
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.page);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogBimbingan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LogBimbingan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const fetchPage = async (p: number) => {
    setIsLoadingPage(true);
    try {
      const res = await apiFetch<PaginatedResponse<LogBimbingan>>(`/api/log?page=${p}&limit=15`);
      setData(res);
      setPage(p);
    } catch {
      addToast('Gagal memuat data log.', 'error');
    } finally {
      setIsLoadingPage(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/api/log/${deleteTarget.id}`, { method: 'DELETE' });
      addToast('Log berhasil dihapus!', 'success');
      setDeleteTarget(null);
      fetchPage(page);
      onRefresh();
    } catch {
      addToast('Gagal menghapus log.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/log/export', '_blank');
  };

  const handleEdit = (log: LogBimbingan) => {
    setEditingLog(log);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setEditingLog(null);
    fetchPage(page);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Log Bimbingan
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onPrint} className="btn-ghost text-sm">
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button onClick={handleExportCSV} className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => { setEditingLog(null); setIsFormOpen(true); }}
            className="btn-primary text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Bimbingan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                {['No', 'Tanggal', 'Bab/Topik', 'Status', 'Catatan Dosen', 'Aksi'].map((h, i) => (
                  <th
                    key={h}
                    className={`${i === 5 ? 'text-right' : 'text-left'} px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider ${
                      i === 4 ? 'hidden md:table-cell' : ''
                    } ${i === 0 ? 'w-12' : ''} ${i === 5 ? 'w-28' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {data.data.map((log, index) => {
                const isExpanded = expandedRow === log.id;
                const rowNum = (page - 1) * 15 + index + 1;
                return (
                  <LogRow
                    key={log.id}
                    log={log}
                    rowNum={rowNum}
                    isExpanded={isExpanded}
                    onToggleExpand={() => setExpandedRow(isExpanded ? null : log.id)}
                    onEdit={() => handleEdit(log)}
                    onDelete={() => setDeleteTarget(log)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {data.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-surface-400">
            <p className="text-sm">Belum ada log bimbingan</p>
          </div>
        )}

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-surface-700">
            <p className="text-xs text-surface-500">
              Halaman {page} dari {data.totalPages} ({data.total} data)
            </p>
            <div className="flex gap-1">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchPage(p)}
                  disabled={isLoadingPage}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    p === page
                      ? 'bg-brand-500 text-white'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <FormLog
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setEditingLog(null); }}
          skripsiId={skripsiId}
          editingLog={editingLog}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Log?"
        message={`Yakin ingin menghapus log "${deleteTarget?.babBahasan}"? Tindakan ini tidak bisa dibatalkan.`}
        isLoading={isDeleting}
      />
    </div>
  );
}

/* Extracted row component to avoid key issues with fragments */
function LogRow({
  log,
  rowNum,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  log: LogBimbingan;
  rowNum: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr
        className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3 text-sm text-surface-500">{rowNum}</td>
        <td className="px-4 py-3 text-sm text-surface-700 dark:text-surface-300 whitespace-nowrap">
          {formatDateShort(log.tanggalBimbingan)}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-surface-100">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-surface-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-surface-400 flex-shrink-0" />
            )}
            {log.babBahasan}
          </div>
        </td>
        <td className="px-4 py-3"><Badge status={log.statusBimbingan} /></td>
        <td className="px-4 py-3 text-sm text-surface-500 hidden md:table-cell max-w-[200px]">
          {log.catatanDosen ? truncate(log.catatanDosen, 50) : '-'}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            {log.linkFile && (
              <a
                href={log.linkFile}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-surface-50/50 dark:bg-surface-800/30">
            <div className="space-y-4">
              {log.deskripsiProgres && (
                <div>
                  <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                    Deskripsi Progres
                  </h4>
                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                    {log.deskripsiProgres}
                  </p>
                </div>
              )}
              {log.catatanDosen && (
                <div>
                  <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                    Checklist Revisi
                  </h4>
                  <ChecklistItems logId={log.id} catatanDosen={log.catatanDosen} />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
