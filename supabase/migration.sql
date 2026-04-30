-- ============================================================
-- Skripsi.an Database Schema
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- 1. Skripsi (thesis profile)
CREATE TABLE IF NOT EXISTS skripsi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nim TEXT NOT NULL,
  nama_mahasiswa TEXT NOT NULL,
  email_mahasiswa TEXT NOT NULL,
  judul_skripsi TEXT NOT NULL,
  dosen_pembimbing TEXT NOT NULL,
  target_lulus TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Log Bimbingan (consultation logs)
CREATE TABLE IF NOT EXISTS log_bimbingan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skripsi_id UUID REFERENCES skripsi(id) ON DELETE CASCADE NOT NULL,
  tanggal_bimbingan DATE NOT NULL,
  bab_bahasan TEXT NOT NULL,
  deskripsi_progres TEXT,
  catatan_dosen TEXT,
  status_bimbingan TEXT NOT NULL DEFAULT 'Menunggu'
    CHECK (status_bimbingan IN ('Menunggu', 'Revisi', 'ACC')),
  link_file TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Checklist Items (revision checklist per log)
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id UUID REFERENCES log_bimbingan(id) ON DELETE CASCADE NOT NULL,
  item_index INT NOT NULL,
  is_checked BOOLEAN DEFAULT false,
  user_email TEXT NOT NULL,
  UNIQUE(log_id, item_index)
);

-- Auto-update `updated_at` trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to skripsi
DROP TRIGGER IF EXISTS set_skripsi_updated_at ON skripsi;
CREATE TRIGGER set_skripsi_updated_at
  BEFORE UPDATE ON skripsi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Attach trigger to log_bimbingan
DROP TRIGGER IF EXISTS set_log_bimbingan_updated_at ON log_bimbingan;
CREATE TRIGGER set_log_bimbingan_updated_at
  BEFORE UPDATE ON log_bimbingan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_skripsi_email ON skripsi(email_mahasiswa);
CREATE INDEX IF NOT EXISTS idx_log_skripsi_id ON log_bimbingan(skripsi_id);
CREATE INDEX IF NOT EXISTS idx_log_tanggal ON log_bimbingan(tanggal_bimbingan DESC);
CREATE INDEX IF NOT EXISTS idx_checklist_log_id ON checklist_items(log_id);

-- Disable RLS for Phase 1 (no authentication)
ALTER TABLE skripsi ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_bimbingan ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon users (Phase 1)
CREATE POLICY "Allow all for anon" ON skripsi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON log_bimbingan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON checklist_items FOR ALL USING (true) WITH CHECK (true);
