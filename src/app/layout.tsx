import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from './providers';
import ToastContainer from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Skripsi.an — Thesis Progress Tracker',
  description:
    'Aplikasi pelacak progres skripsi untuk mahasiswa Indonesia. Kelola bimbingan, revisi, dan target wisuda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
