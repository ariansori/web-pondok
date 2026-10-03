import type { Metadata } from 'next';
import { ChevronRight, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Identitas Pesantren' };

const IDENTITAS = [
  { label: 'Nama Lengkap', value: 'Pondok Pesantren Salafi Al-Fatich' },
  { label: 'Tahun Berdiri', value: '1988' },
  { label: 'Pendiri', value: 'KH. Ali Tamam bin Mu\'abih. Abdul Mu\'in' },
  { label: 'Pengasuh', value: 'KH. Ali Tamam & Ny. Hj. Nah\'ah' },
  { label: 'Status', value: 'Pesantren Salafi Swasta' },
  { label: 'NSPP', value: '510035780001' },
  { label: 'Alamat', value: 'Jl. Tambak Osowilangun No. 98, Kec. Benowo, Kota Surabaya, Jawa Timur 60191' },
  { label: 'Telepon', value: '081-758-4276' },
  { label: 'Email', value: 'pondokpesantrenalfattichsurabaya@gmail.com' },
  { label: 'Jumlah Santri', value: '±1.250 Santri (Putra & Putri)' },
  { label: 'Jumlah Pengajar', value: '87 Asatidz' },
  { label: 'Unit Pendidikan', value: '6 Unit (RA, MI, MTs, MA, MAQ, MD)' },
];

export default function IdentitasPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} /><span className="text-white font-medium">Identitas Pesantren</span>
          </nav>
          <h1 className="text-white text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Identitas Pesantren</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6" style={{ background: 'linear-gradient(135deg, #169645, #0D5C2B)' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl border-2 border-yellow-400/40">🕌</div>
              <div>
                <h2 className="text-white font-bold text-xl">PP Al-Fatich Surabaya</h2>
                <p className="text-white/70 text-sm">Pondok Pesantren Salafi • Berdiri 1988</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {IDENTITAS.map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-green-50/50 transition-colors">
                <dt className="sm:w-48 font-semibold text-gray-500 text-sm flex-shrink-0 mb-1 sm:mb-0">{item.label}</dt>
                <dd className="font-medium text-gray-900 text-sm">{item.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
