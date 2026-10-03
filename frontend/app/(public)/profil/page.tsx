'use client';

import Link from 'next/link';
import { 
  BookOpen, 
  History, 
  UserCheck, 
  Compass, 
  Target, 
  Network, 
  ChevronRight, 
  ShieldCheck, 
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const PROFIL_CARDS = [
  {
    title: 'Sejarah Singkat',
    desc: 'Perjalanan panjang PP Al-Fatich sejak 1988 dalam mendidik generasi santri yang berakhlaq mulia dan bertafaqquh fid-din.',
    href: '/profil/sejarah',
    icon: History,
    color: '#169645',
    badge: '1988 - Sekarang'
  },
  {
    title: 'Biografi Pendiri',
    desc: 'Mengenal sosok KH. Ali Tamam bin Mu\'abih. Abdul Mu\'in beserta perjuangan beliau meletakkan pondasi dakwah.',
    href: '/profil/pendiri',
    icon: UserCheck,
    color: '#0D5C2B',
    badge: 'Keluarga Ndalem'
  },
  {
    title: 'Filosofi Lambang',
    desc: 'Makna simbolik di balik lambang Al-Fatich: Ka\'bah, Kitab Turats, Pena Emas, Menara Dakwah, dan Bola Dunia.',
    href: '/profil/filosofi',
    icon: Compass,
    color: '#F4B41A',
    badge: 'Nilai Filosofis'
  },
  {
    title: 'Visi & Misi',
    desc: 'Arah haluan dan target pendidikan pesantren dalam mencetak kader ulama dan insan berkarakter Qur\'ani.',
    href: '/profil/visi-misi',
    icon: Target,
    color: '#169645',
    badge: 'Landasan Gerak'
  },
  {
    title: 'Struktur Organisasi',
    desc: 'Bagan kepengurusan yayasan, majelis pengasuh, dewan asatidz, dan pengurus harian Pondok Pesantren Al-Fatich.',
    href: '/profil/struktur',
    icon: Network,
    color: '#0D5C2B',
    badge: 'Manajemen'
  },
  {
    title: 'Identitas Pesantren',
    desc: 'Legalitas resmi Kemenag, nomor statistik (NSPP), data kontak, alamat lengkap, dan profil kelembagaan.',
    href: '/profil/identitas',
    icon: ShieldCheck,
    color: '#F4B41A',
    badge: 'Data Resmi'
  },
];

export default function ProfilHubPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Hero Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Profil Pesantren</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} />
              Pondok Pesantren Salafi
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Profil Pondok Pesantren Al-Fatich
          </h1>
          <p className="text-white/80 max-w-3xl text-base sm:text-lg leading-relaxed">
            Mengenal lebih dekat sejarah, visi misi keilmuan, kepemimpinan, dan nilai-nilai luhur yang menjadi pedoman PP Al-Fatich Surabaya sejak tahun 1988.
          </p>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quote / Tagline Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-green-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full pointer-events-none" />
          <div className="max-w-3xl relative z-10">
            <p className="text-xs font-extrabold uppercase tracking-widest text-green-700 mb-2">Motto Pesantren</p>
            <blockquote className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              &ldquo;Tekun dalam Bertafaqquh fid-Din, Amanah dalam Berkhidmah, dan Teguh dalam Perjuangan Agama dan Bangsa.&rdquo;
            </blockquote>
            <p className="text-sm text-gray-600">
              Pondok Pesantren Salafi Al-Fatich senantiasa menjaga keseimbangan antara kedalaman kajian kitab kuning (turats) dengan penguatan karakter Qur&apos;ani dan kebangsaan.
            </p>
          </div>
        </div>

        {/* 6 Sub-profile Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFIL_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: card.color }}
                />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${card.color}, #0D5C2B)` }}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 group-hover:bg-green-100 group-hover:text-green-800 transition-colors">
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {card.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <div className="flex items-center text-sm font-bold text-green-700 group-hover:text-green-800 transition-colors gap-1 pt-4 border-t border-gray-100">
                  <span>Lihat Selengkapnya</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Identity Footnote */}
        <div className="mt-12 bg-gradient-to-r from-green-900 to-green-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              Ingin Mengetahui Lebih Lanjut?
            </h3>
            <p className="text-white/80 text-sm max-w-xl">
              Hubungi layanan informasi kami atau ikuti tur virtual keliling kompleks pesantren Al-Fatich Surabaya secara interaktif.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/informasi/tour"
              className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              Virtual Tour 360°
            </Link>
            <Link
              href="/profil/identitas"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/30 transition-colors"
            >
              Kontak Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
