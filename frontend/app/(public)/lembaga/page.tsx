'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Star, School, Layers, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { fetchLembaga, LembagaItem } from '@/lib/api';

const TABS = ['Semua', 'Dloruriyat', 'Hajiyat'] as const;

const DEFAULT_LEMBAGA = [
  {
    id: 'maq',
    nama: "Madrasah Al-Qur'an",
    singkatan: 'MAQ',
    kategori: 'dloruriyat',
    desc: "Program unggulan hafalan dan pemahaman Al-Qur'an 30 Juz secara mendalam dengan metode talaqqi yang bersambung sanadnya hingga Rasulullah SAW.",
    kurikulum: ["Tahfidz Al-Qur'an 30 Juz", "Tajwid Dasar & Lanjutan", "Qira'ah Sab'ah", "Tafsir Al-Qur'an", "Ilmu Hadits"],
    icon: BookOpen,
    color: '#169645',
    bg: '#F0FFF4',
  },
  {
    id: 'md',
    nama: 'Madrasah Diniyah',
    singkatan: 'MD',
    kategori: 'dloruriyat',
    desc: 'Lembaga pendidikan agama Islam yang mengkaji kitab-kitab turats (klasik) secara sistematis dengan metode sorogan dan bandongan.',
    kurikulum: ['Fiqih (Fathul Qarib)', 'Aqidah (Ummul Barahin)', 'Nahwu (Jurumiyah/Alfiyah)', 'Sharaf (Matan Bina)', 'Hadits (Riyadhus Shalihin)', 'Tafsir Jalalain'],
    icon: BookOpen,
    color: '#0D5C2B',
    bg: '#E8F5E9',
  },
  {
    id: 'ra',
    nama: 'Raudhatul Athfal',
    singkatan: 'RA',
    kategori: 'hajiyat',
    desc: 'Pendidikan anak usia dini (4-6 tahun) dengan nuansa Islami yang menyenangkan dan stimulatif berbasis Kurikulum Kemenag RI.',
    kurikulum: ['Kurikulum Merdeka Kemenag', 'Pengenalan Huruf Hijaiyah', 'Doa-Doa Harian', 'Akhlaq Dasar', 'Seni & Kreativitas Islami'],
    icon: Star,
    color: '#F4B41A',
    bg: '#FFFBEB',
  },
  {
    id: 'mi',
    nama: 'Madrasah Ibtidaiyah',
    singkatan: 'MI',
    kategori: 'hajiyat',
    desc: 'Setingkat SD dengan kurikulum terpadu antara ilmu agama dan ilmu pengetahuan umum berbasis Kementerian Agama RI.',
    kurikulum: ["Al-Qur'an Hadits", 'Aqidah Akhlaq', 'Fiqih', 'SKI', 'Bahasa Arab', 'Matematika', 'IPAS'],
    icon: School,
    color: '#169645',
    bg: '#F0FFF4',
  },
  {
    id: 'mts',
    nama: 'Madrasah Tsanawiyah',
    singkatan: 'MTs',
    kategori: 'hajiyat',
    desc: 'Setingkat SMP dengan pendalaman ilmu agama Islam dan penguasaan ilmu pengetahuan modern secara berimbang.',
    kurikulum: ['Aqidah Akhlaq Lanjutan', 'Fiqih & Ushul Fiqih', 'SKI', 'Bahasa Arab Lanjutan', 'IPA Terpadu', 'IPS', 'Matematika', 'Bahasa Inggris'],
    icon: Layers,
    color: '#0D5C2B',
    bg: '#E8F5E9',
  },
  {
    id: 'ma',
    nama: 'Madrasah Aliyah',
    singkatan: 'MA',
    kategori: 'hajiyat',
    desc: 'Setingkat SMA dengan program keislaman lanjutan, peminatan IPA/IPS, dan persiapan menuju perguruan tinggi berkualitas.',
    kurikulum: ['Ushul Fiqih', 'Tafsir & Ilmu Tafsir', 'Hadits & Ilmu Hadits', 'Bahasa Arab Lanjutan', 'Sains / Sosial / Bahasa', 'Persiapan Masuk PTKIN/PTN'],
    icon: Award,
    color: '#F4B41A',
    bg: '#FFFBEB',
  },
];

const ICONS_MAP: Record<string, any> = {
  maq: BookOpen,
  md: BookOpen,
  ra: Star,
  mi: School,
  mts: Layers,
  ma: Award,
};

export default function LembagaPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Semua');
  const [lembagaList, setLembagaList] = useState(DEFAULT_LEMBAGA);

  useEffect(() => {
    fetchLembaga()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: LembagaItem, i: number) => {
            const fallback = DEFAULT_LEMBAGA[i % DEFAULT_LEMBAGA.length];
            const parsedKurikulum = Array.isArray(item.kurikulum)
              ? item.kurikulum
              : typeof item.kurikulum === 'string'
              ? item.kurikulum.split(',').map(s => s.trim())
              : fallback.kurikulum;

            return {
              id: String(item.id),
              nama: item.nama,
              singkatan: item.singkatan || fallback.singkatan,
              kategori: item.kategori || fallback.kategori,
              desc: item.deskripsi || fallback.desc,
              kurikulum: parsedKurikulum,
              icon: fallback.icon,
              color: fallback.color,
              bg: fallback.bg,
            };
          });
          setLembagaList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = activeTab === 'Semua'
    ? lembagaList
    : lembagaList.filter((l) => l.kategori.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Lembaga Pendidikan</span>
          </nav>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Lembaga Pendidikan Al-Fatich
          </h1>
          <p className="text-white/70 max-w-2xl text-sm sm:text-base">
            Dua program utama — <strong>Dloruriyat</strong> dan <strong>Hajiyat</strong> — dirancang untuk mencetak generasi unggul dalam ilmu agama sekaligus siap menghadapi tantangan zaman.
          </p>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-3 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm"
              style={
                activeTab === tab
                  ? { background: 'linear-gradient(135deg, #169645, #0D5C2B)', color: '#fff' }
                  : { background: '#fff', color: '#169645', border: '1.5px solid #169645' }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((item) => {
            const Icon = item.icon || BookOpen;
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden card-hover flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="p-6 flex items-center gap-4" style={{ background: `${item.color}10` }}>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow"
                      style={{ background: item.color }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: item.color }}
                      >
                        {item.kategori}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.nama}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{item.desc}</p>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Fokus & Kurikulum Pokok
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {item.kurikulum.map((k, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 mt-auto border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">Pondok Pesantren Al-Fatich</span>
                  <Link
                    href="/psmb"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 transition-colors"
                  >
                    Daftar Masuk <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
