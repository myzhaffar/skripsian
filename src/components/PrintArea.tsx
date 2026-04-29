'use client';

import { forwardRef } from 'react';
import { LogBimbingan, Skripsi, formatDate } from '@/lib/utils';

interface PrintAreaProps {
  skripsi: Skripsi;
  logs: LogBimbingan[];
}

const PrintArea = forwardRef<HTMLDivElement, PrintAreaProps>(
  ({ skripsi, logs }, ref) => {
    return (
      <div ref={ref} className="hidden print:block p-8 bg-white text-black print-area">
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-xl font-bold uppercase">Kartu Bimbingan Skripsi</h1>
          <p className="text-sm mt-1">Program Studi Informatika</p>
        </div>
        <table className="w-full mb-6 text-sm">
          <tbody>
            <tr><td className="py-1 w-40 font-semibold">NIM</td><td>: {skripsi.nim}</td></tr>
            <tr><td className="py-1 font-semibold">Nama</td><td>: {skripsi.namaMahasiswa}</td></tr>
            <tr><td className="py-1 font-semibold">Judul Skripsi</td><td>: {skripsi.judulSkripsi}</td></tr>
            <tr><td className="py-1 font-semibold">Dosen Pembimbing</td><td>: {skripsi.dosenPembimbing}</td></tr>
          </tbody>
        </table>
        <table className="w-full border-collapse text-xs mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-2 py-2 text-left">No</th>
              <th className="border border-gray-400 px-2 py-2 text-left">Tanggal</th>
              <th className="border border-gray-400 px-2 py-2 text-left">Bab/Topik</th>
              <th className="border border-gray-400 px-2 py-2 text-left">Deskripsi</th>
              <th className="border border-gray-400 px-2 py-2 text-left">Catatan Dosen</th>
              <th className="border border-gray-400 px-2 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={log.id}>
                <td className="border border-gray-400 px-2 py-1.5">{i + 1}</td>
                <td className="border border-gray-400 px-2 py-1.5">{formatDate(log.tanggalBimbingan)}</td>
                <td className="border border-gray-400 px-2 py-1.5">{log.babBahasan}</td>
                <td className="border border-gray-400 px-2 py-1.5">{log.deskripsiProgres || '-'}</td>
                <td className="border border-gray-400 px-2 py-1.5">{log.catatanDosen || '-'}</td>
                <td className="border border-gray-400 px-2 py-1.5">{log.statusBimbingan}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-16">
          <div className="text-center">
            <p className="text-sm">Mahasiswa,</p>
            <div className="h-20" />
            <p className="text-sm font-semibold border-t border-black pt-1">{skripsi.namaMahasiswa}</p>
            <p className="text-xs">NIM: {skripsi.nim}</p>
          </div>
          <div className="text-center">
            <p className="text-sm">Dosen Pembimbing,</p>
            <div className="h-20" />
            <p className="text-sm font-semibold border-t border-black pt-1">{skripsi.dosenPembimbing}</p>
            <p className="text-xs">NIP: ________________</p>
          </div>
        </div>
      </div>
    );
  }
);

PrintArea.displayName = 'PrintArea';
export default PrintArea;
