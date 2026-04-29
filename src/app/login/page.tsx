import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-surface-950 dark:via-surface-900 dark:to-brand-950 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            Skripsi.an
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Thesis Progress Tracker
          </p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="label-text">Email</label>
            <input
              type="email"
              className="input-field"
              value="dev@test.com"
              readOnly
            />
          </div>
          <div>
            <label className="label-text">Password</label>
            <input
              type="password"
              className="input-field"
              value="password"
              readOnly
            />
          </div>
          <Link href="/" className="btn-primary w-full text-center block">
            Masuk
          </Link>
          <p className="text-xs text-center text-surface-400 dark:text-surface-500">
            Phase 1 — Login placeholder, tidak ada autentikasi
          </p>
        </div>
      </div>
    </div>
  );
}
