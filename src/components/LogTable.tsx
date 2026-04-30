'use client';

import { useState } from 'react';
import {
  LogBimbingan,
  PaginatedResponse,
  formatDateShort,
  truncate,
} from '@/lib/utils';
import { getLogs, deleteLog as deleteLogQuery, exportLogsCSV } from '@/lib/supabase-queries';
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
      const res = await getLogs(skripsiId, p, 15);
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
      await deleteLogQuery(deleteTarget.id);
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

  const handleExportCSV = async () => {
    try {
      await exportLogsCSV(skripsiId);
      addToast('CSV berhasil diunduh!', 'success');
    } catch {
      addToast('Gagal mengekspor CSV.', 'error');
    }
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
        <h1 className="text-2xl font-heading font-extrabold text-foreground">
          Log Bimbingan
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onPrint} className="btn-ghost text-sm">
            <Printer className="w-4 h-4" strokeWidth={2.5} />
            Cetak
          </button>
          <button onClick={handleExportCSV} className="btn-secondary text-sm !px-4 !py-2">
            <Download className="w-4 h-4" strokeWidth={2.5} />
            Export CSV
          </button>
          <button
            onClick={() => { setEditingLog(null); setIsFormOpen(true); }}
            className="btn-primary text-sm !px-4 !py-2"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Tambah Bimbingan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary/5 border-2 border-foreground rounded-[16px] shadow-sticker-pink overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-accent text-white">
                {['No', 'Tanggal', 'Bab/Topik', 'Status', 'Catatan Dosen', 'Aksi'].map((h, i) => (
                  <th
                    key={h}
                    className={`${i === 5 ? 'text-right' : 'text-left'} px-4 py-3 text-xs font-heading font-bold uppercase tracking-wider ${
                      i === 4 ? 'hidden md:table-cell' : ''
                    } ${i === 0 ? 'w-12' : ''} ${i === 5 ? 'w-28' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((log, index) => {
                const isExpanded = expandedRow === log.id;
                const rowNum = (page - 1) * 15 + index + 1;
                return (
                  <LogRow
                    key={log.id}
                    log={log}
                    rowNum={rowNum}
                    isExpanded={isExpanded}
                    isEven={index % 2 === 0}
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
          <div className="flex flex-col items-center justify-center py-12 text-muted-fg">
            <p className="text-sm font-heading font-semibold">Belum ada log bimbingan</p>
          </div>
        )}

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t-2 border-border">
            <p className="text-xs text-muted-fg font-heading font-semibold">
              Halaman {page} dari {data.totalPages} ({data.total} data)
            </p>
            <div className="flex gap-1">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchPage(p)}
                  disabled={isLoadingPage}
                  className={`px-3 py-1.5 text-xs rounded-full font-heading font-bold border-2 transition-all duration-300 ease-bouncy ${
                    p === page
                      ? 'bg-accent text-white border-foreground shadow-[2px_2px_0px_0px_#1E293B]'
                      : 'text-foreground border-transparent hover:border-foreground hover:bg-muted'
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

/* Extracted row component */
function LogRow({
  log,
  rowNum,
  isExpanded,
  isEven,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  log: LogBimbingan;
  rowNum: number;
  isExpanded: boolean;
  isEven: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr
        className={`hover:bg-tertiary/10 transition-colors cursor-pointer border-b border-border ${isEven ? 'bg-muted/30' : 'bg-card'}`}
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3 text-sm text-muted-fg font-heading font-bold">{rowNum}</td>
        <td className="px-4 py-3 text-sm text-foreground font-sans whitespace-nowrap">
          {formatDateShort(log.tanggalBimbingan)}
        </td>
        <td className="px-4 py-3 text-sm font-heading font-bold text-foreground">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={2.5} />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-fg flex-shrink-0" strokeWidth={2.5} />
            )}
            {log.babBahasan}
          </div>
        </td>
        <td className="px-4 py-3"><Badge status={log.statusBimbingan} /></td>
        <td className="px-4 py-3 text-sm text-muted-fg font-sans hidden md:table-cell max-w-[200px]">
          {log.catatanDosen ? truncate(log.catatanDosen, 50) : '-'}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            {log.linkFile && (
              <a
                href={log.linkFile}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground hover:bg-accent/10 flex items-center justify-center text-accent transition-all duration-300 ease-bouncy"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
              </a>
            )}
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground hover:bg-tertiary/30 flex items-center justify-center text-foreground transition-all duration-300 ease-bouncy"
            >
              <Edit3 className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground hover:bg-red-100 flex items-center justify-center text-red-500 transition-all duration-300 ease-bouncy"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-accent/5 border-b border-border">
            <div className="space-y-4">
              {log.deskripsiProgres && (
                <div>
                  <h4 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider mb-2">
                    Deskripsi Progres
                  </h4>
                  <p className="text-sm text-foreground/70 font-sans leading-relaxed">
                    {log.deskripsiProgres}
                  </p>
                </div>
              )}
              {log.catatanDosen && (
                <div>
                  <h4 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider mb-2">
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
