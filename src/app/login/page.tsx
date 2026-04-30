import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-tertiary/30 border-2 border-foreground/10" />
      <div className="absolute bottom-20 right-16 w-16 h-16 rotate-45 bg-secondary/20 border-2 border-foreground/10" />
      <div className="absolute top-1/3 right-10 w-10 h-10 rounded-full bg-quaternary/25 border-2 border-foreground/10" />
      <div className="absolute bottom-10 left-1/4 w-8 h-8 rotate-12 bg-accent/15 border-2 border-foreground/10" />

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent border-2 border-foreground shadow-pop flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-9 h-9 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">
            Skripsi.an
          </h1>
          <p className="text-sm text-muted-fg font-heading font-semibold mt-1 uppercase tracking-widest">
            Thesis Progress Tracker
          </p>
        </div>

        <div className="bg-card border-2 border-foreground rounded-[16px] shadow-sticker-violet p-6 space-y-4">
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
          <p className="text-xs text-center text-muted-fg font-sans">
            Phase 1 — Login placeholder, tidak ada autentikasi
          </p>
        </div>
      </div>
    </div>
  );
}
