// Data types matching the API
export type StatusBimbingan = 'Menunggu' | 'Revisi' | 'ACC';

export type Skripsi = {
  id: string;
  nim: string;
  namaMahasiswa: string;
  emailMahasiswa: string;
  judulSkripsi: string;
  dosenPembimbing: string;
  targetLulus: string; // 'YYYY-MM' format
};

export type LogBimbingan = {
  id: string;
  skripsiId: string;
  tanggalBimbingan: string; // ISO date string
  babBahasan: string;
  deskripsiProgres?: string;
  catatanDosen?: string; // newline-separated revision notes
  statusBimbingan: StatusBimbingan;
  linkFile?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
};

// Utility functions


/**
 * Merge class names conditionally (simplified cn utility)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format ISO date string to Indonesian locale
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format ISO date string to short format
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Calculate days remaining from today to target month (last day of month)
 */
export function daysRemaining(targetYYYYMM: string): number {
  const [year, month] = targetYYYYMM.split('-').map(Number);
  // Last day of the target month
  const targetDate = new Date(year, month, 0); // month is 1-indexed here, day 0 = last day of previous month
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diff = targetDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days since a given date
 */
export function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diff = today.getTime() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, maxLength: number = 60): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}
