import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Struktur Organisasi' };

const ORG = {
  pengasuh: { label: 'Pengasuh', name: 'KH. Ali Tamam', sub: 'Pendiri & Pengasuh Utama' },
  wakil: { label: 'Wakil Pengasuh', name: 'Ny. Hj. Nah\'ah', sub: 'Pengasuh Pondok Putri' },
  ketua: { label: 'Ketua Yayasan', name: 'H. Ahmad Fauzan, S.Pd.', sub: 'Ketua Umum Yayasan' },
  divisi: [
    { label: 'Kepala Diniyah', name: 'Ust. Muhammad Sholeh', role: 'Koordinator Pendidikan Diniyah' },
    { label: 'Kepala MAQ', name: 'Ust. Hafidz Qur\'ani', role: 'Koordinator Tahfidz Al-Qur\'an' },
    { label: 'Kepala RA/MI', name: 'Ustadzah Khodijah, S.Pd.', role: 'Kepala RA & MI Al-Fatich' },
    { label: 'Kepala MTs', name: 'H. Miftahul Ulum, M.Pd.', role: 'Kepala MTs Al-Fatich' },
    { label: 'Kepala MA', name: 'Drs. Abdul Hamid', role: 'Kepala MA Al-Fatich' },
    { label: 'Bag. Administrasi', name: 'Ahmad Rizki, S.E.', role: 'Kepala Tata Usaha & Keuangan' },
  ],
};

function OrgCard({ name, label, sub, color = '#169645' }: { name: string; label: string; sub: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border-t-4 text-center min-w-[160px]"
      style={{ borderColor: color }}>
      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-lg"
        style={{ background: `linear-gradient(135deg, ${color}, #0D5C2B)` }}>
        👤
      </div>
      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</p>
      <p className="font-bold text-gray-900 text-sm">{name}</p>
      <p className="text-gray-400 text-xs mt-1">{sub}</p>
    </div>
  );
}

export default function StrukturPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} /><span className="text-white font-medium">Struktur Organisasi</span>
          </nav>
          <h1 className="text-white text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Struktur Organisasi</h1>
          <p className="text-white/70 mt-2">Susunan kepengurusan Pondok Pesantren Al-Fatich Surabaya.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Level */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
          <OrgCard {...ORG.pengasuh} color="#169645" />
          <OrgCard {...ORG.wakil} color="#169645" />
        </div>

        {/* Connector */}
        <div className="flex justify-center mb-6">
          <div className="w-0.5 h-8 bg-green-300" />
        </div>

        <div className="flex justify-center mb-8">
          <OrgCard {...ORG.ketua} color="#F4B41A" />
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-0.5 h-8 bg-green-300" />
        </div>

        {/* Division Level */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ORG.divisi.map((d) => (
            <div key={d.label} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 text-center card-hover">
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #169645, #0D5C2B)' }}>
                👤
              </div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">{d.label}</p>
              <p className="font-bold text-gray-900 text-sm">{d.name}</p>
              <p className="text-gray-400 text-xs mt-1">{d.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
