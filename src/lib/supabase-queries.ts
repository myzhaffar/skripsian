import { supabase } from './supabase';
import type { Skripsi, LogBimbingan, PaginatedResponse, StatusBimbingan } from './utils';

/**
 * Hardcoded user email for Phase 1
 */
export const USER_EMAIL = 'dev@test.com';

// ─── Helper: snake_case DB row → camelCase TS type ────────────────────────

function rowToSkripsi(row: {
  id: string;
  nim: string;
  nama_mahasiswa: string;
  email_mahasiswa: string;
  judul_skripsi: string;
  dosen_pembimbing: string;
  target_lulus: string;
  created_at: string;
  updated_at: string;
}): Skripsi {
  return {
    id: row.id,
    nim: row.nim,
    namaMahasiswa: row.nama_mahasiswa,
    emailMahasiswa: row.email_mahasiswa,
    judulSkripsi: row.judul_skripsi,
    dosenPembimbing: row.dosen_pembimbing,
    targetLulus: row.target_lulus,
  };
}

function rowToLog(row: {
  id: string;
  skripsi_id: string;
  tanggal_bimbingan: string;
  bab_bahasan: string;
  deskripsi_progres: string | null;
  catatan_dosen: string | null;
  status_bimbingan: string;
  link_file: string | null;
  created_at: string;
  updated_at: string;
}): LogBimbingan {
  return {
    id: row.id,
    skripsiId: row.skripsi_id,
    tanggalBimbingan: row.tanggal_bimbingan,
    babBahasan: row.bab_bahasan,
    deskripsiProgres: row.deskripsi_progres ?? undefined,
    catatanDosen: row.catatan_dosen ?? undefined,
    statusBimbingan: row.status_bimbingan as StatusBimbingan,
    linkFile: row.link_file ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Skripsi Queries ──────────────────────────────────────────────────────

/**
 * Fetch the skripsi profile for a given email (returns first match or null).
 */
export async function getSkripsi(email: string = USER_EMAIL): Promise<Skripsi | null> {
  const { data, error } = await supabase
    .from('skripsi')
    .select('*')
    .eq('email_mahasiswa', email)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch skripsi: ${error.message}`);
  if (!data) return null;
  return rowToSkripsi(data);
}

/**
 * Create a new skripsi profile.
 */
export async function createSkripsi(data: {
  nim: string;
  namaMahasiswa: string;
  emailMahasiswa: string;
  judulSkripsi: string;
  dosenPembimbing: string;
  targetLulus: string;
}): Promise<Skripsi> {
  const { data: row, error } = await supabase
    .from('skripsi')
    .insert({
      nim: data.nim,
      nama_mahasiswa: data.namaMahasiswa,
      email_mahasiswa: data.emailMahasiswa,
      judul_skripsi: data.judulSkripsi,
      dosen_pembimbing: data.dosenPembimbing,
      target_lulus: data.targetLulus,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create skripsi: ${error.message}`);
  return rowToSkripsi(row);
}

/**
 * Update an existing skripsi profile.
 */
export async function updateSkripsi(
  id: string,
  data: {
    nim: string;
    namaMahasiswa: string;
    emailMahasiswa: string;
    judulSkripsi: string;
    dosenPembimbing: string;
    targetLulus: string;
  }
): Promise<Skripsi> {
  const { data: row, error } = await supabase
    .from('skripsi')
    .update({
      nim: data.nim,
      nama_mahasiswa: data.namaMahasiswa,
      email_mahasiswa: data.emailMahasiswa,
      judul_skripsi: data.judulSkripsi,
      dosen_pembimbing: data.dosenPembimbing,
      target_lulus: data.targetLulus,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update skripsi: ${error.message}`);
  return rowToSkripsi(row);
}

// ─── Log Bimbingan Queries ────────────────────────────────────────────────

/**
 * Fetch paginated consultation logs for a skripsi.
 */
export async function getLogs(
  skripsiId: string,
  page: number = 1,
  limit: number = 15
): Promise<PaginatedResponse<LogBimbingan>> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get total count
  const { count, error: countError } = await supabase
    .from('log_bimbingan')
    .select('*', { count: 'exact', head: true })
    .eq('skripsi_id', skripsiId);

  if (countError) throw new Error(`Failed to count logs: ${countError.message}`);

  // Get paginated data
  const { data, error } = await supabase
    .from('log_bimbingan')
    .select('*')
    .eq('skripsi_id', skripsiId)
    .order('tanggal_bimbingan', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to fetch logs: ${error.message}`);

  const total = count ?? 0;
  return {
    data: (data || []).map(rowToLog),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetch ALL logs for a skripsi (for dashboard stats / print).
 */
export async function getAllLogs(skripsiId: string): Promise<LogBimbingan[]> {
  const { data, error } = await supabase
    .from('log_bimbingan')
    .select('*')
    .eq('skripsi_id', skripsiId)
    .order('tanggal_bimbingan', { ascending: false });

  if (error) throw new Error(`Failed to fetch all logs: ${error.message}`);
  return (data || []).map(rowToLog);
}

/**
 * Create a new log entry.
 */
export async function createLog(data: {
  skripsiId: string;
  tanggalBimbingan: string;
  babBahasan: string;
  deskripsiProgres?: string;
  catatanDosen?: string;
  statusBimbingan: StatusBimbingan;
  linkFile?: string;
}): Promise<LogBimbingan> {
  const { data: row, error } = await supabase
    .from('log_bimbingan')
    .insert({
      skripsi_id: data.skripsiId,
      tanggal_bimbingan: data.tanggalBimbingan,
      bab_bahasan: data.babBahasan,
      deskripsi_progres: data.deskripsiProgres || null,
      catatan_dosen: data.catatanDosen || null,
      status_bimbingan: data.statusBimbingan,
      link_file: data.linkFile || null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create log: ${error.message}`);
  return rowToLog(row);
}

/**
 * Update an existing log entry.
 */
export async function updateLog(
  id: string,
  data: {
    tanggalBimbingan: string;
    babBahasan: string;
    deskripsiProgres?: string;
    catatanDosen?: string;
    statusBimbingan: StatusBimbingan;
    linkFile?: string;
  }
): Promise<LogBimbingan> {
  const { data: row, error } = await supabase
    .from('log_bimbingan')
    .update({
      tanggal_bimbingan: data.tanggalBimbingan,
      bab_bahasan: data.babBahasan,
      deskripsi_progres: data.deskripsiProgres || null,
      catatan_dosen: data.catatanDosen || null,
      status_bimbingan: data.statusBimbingan,
      link_file: data.linkFile || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update log: ${error.message}`);
  return rowToLog(row);
}

/**
 * Delete a log entry.
 */
export async function deleteLog(id: string): Promise<void> {
  const { error } = await supabase
    .from('log_bimbingan')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete log: ${error.message}`);
}

// ─── Checklist Queries ────────────────────────────────────────────────────

/**
 * Get all checklist items for a given log.
 * Returns a Record<number, boolean> mapping item_index to is_checked.
 */
export async function getChecklistItems(logId: string): Promise<Record<number, boolean>> {
  const { data, error } = await supabase
    .from('checklist_items')
    .select('item_index, is_checked')
    .eq('log_id', logId);

  if (error) throw new Error(`Failed to fetch checklist: ${error.message}`);

  const result: Record<number, boolean> = {};
  (data || []).forEach((item) => {
    result[item.item_index] = item.is_checked;
  });
  return result;
}

/**
 * Toggle a checklist item (upsert).
 */
export async function toggleChecklist(
  logId: string,
  itemIndex: number,
  isChecked: boolean,
  userEmail: string = USER_EMAIL
): Promise<void> {
  const { error } = await supabase
    .from('checklist_items')
    .upsert(
      {
        log_id: logId,
        item_index: itemIndex,
        is_checked: isChecked,
        user_email: userEmail,
      },
      { onConflict: 'log_id,item_index' }
    );

  if (error) throw new Error(`Failed to toggle checklist: ${error.message}`);
}

// ─── CSV Export ───────────────────────────────────────────────────────────

/**
 * Generate a CSV string from all logs and trigger download.
 */
export async function exportLogsCSV(skripsiId: string): Promise<void> {
  const logs = await getAllLogs(skripsiId);

  const headers = ['No', 'Tanggal', 'Bab/Topik', 'Deskripsi Progres', 'Catatan Dosen', 'Status', 'Link File'];
  const csvRows = [headers.join(',')];

  logs.forEach((log, i) => {
    const row = [
      i + 1,
      `"${log.tanggalBimbingan}"`,
      `"${(log.babBahasan || '').replace(/"/g, '""')}"`,
      `"${(log.deskripsiProgres || '').replace(/"/g, '""')}"`,
      `"${(log.catatanDosen || '').replace(/"/g, '""')}"`,
      `"${log.statusBimbingan}"`,
      `"${log.linkFile || ''}"`,
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `log_bimbingan_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
