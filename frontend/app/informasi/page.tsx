'use client';

import Link from 'next/link';
import { 
  CalendarDays, 
  Megaphone, 
  Image as ImageIcon, 
  Compass, 
  ChevronRight, 
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';

const INFO_CHANNELS = [
  {
    title: 'Agenda Pesantren',
    desc: 'Jadwal rangkaian kegiatan santri, kalender akademik, peringatan hari besar Islam, wisuda akbar, dan ujian madrasah.',
    href: '/informasi/agenda',
    icon: CalendarDays,
    color: '#169645',
    tag: 'Kalender & Acara'
  },
  {
    title: 'Maklumat & Pengumuman',
    desc: 'Pemberitahuan resmi dari Pengasuh dan Pengurus Pesantren mengenai kebijakan, jadwal libur, dan informasi penting.',
    href: '/informasi/maklumat',
    icon: Megaphone,
    color: '#0D5C2B',
    tag: 'Surat & Berita Resmi'
  },
  {
    title: 'Galeri Kegiatan',
    desc: 'Dokumentasi foto dan video aktivitas santri dalam mengaji, belajar, berolahraga, ekstrakurikuler, dan perlombaan.',
    href: '/informasi/galeri',
    icon: ImageIcon,
    color: '#F4B41A',
    tag: 'Foto & Video'
  },
  {
    title: 'Virtual Campus Tour',
    desc: 'Jelajahi denah interaktif kompleks Pondok Pesantren Al-Fatich: Masjid Jami\', Asrama, Madrasah, dan Fasilitas lainnya.',
    href: '/informasi/tour',
    icon: Compass,
    color: '#169645',
    tag: 'Peta & Lokasi'
  },
];

export default function InformasiHubPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Pusat Informasi</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Info size={13} />
              Portal Informasi Terpadu
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Informasi & Warta Pesantren
          </h1>
          <p className="text-white/80 max-w-2xl text-base sm:text-lg">
            Akses seluruh agenda, maklumat pengasuh, dokumentasi galeri santri, serta jelajah virtual Pondok Pesantren Salafi Al-Fatich.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INFO_CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <Link
                key={ch.href}
                href={ch.href}
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ background: ch.color }}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${ch.color}, #0D5C2B)` }}
                    >
                      <Icon size={26} />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 group-hover:bg-green-100 group-hover:text-green-800 transition-colors">
                      {ch.tag}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {ch.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {ch.desc}
                  </p>
                </div>

                <div className="flex items-center text-sm font-bold text-green-700 group-hover:text-green-800 transition-colors gap-1 pt-4 border-t border-gray-100">
                  <span>Buka Halaman</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
