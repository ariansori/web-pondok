'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Image as ImageIcon, Play, Search, Filter, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { fetchGaleri, GaleriItem } from '@/lib/api';

const CATEGORIES = ['Semua', 'Kegiatan', 'Wisuda', 'Akademik', 'Fasilitas', 'Kajian', 'Sosial', 'Perlombaan'];
const TYPES = ['Semua', 'Foto', 'Video'];

const FALLBACK_GALLERY = [
  { id: 1, judul: 'Haflah Akhirussanah 2025', tipe: 'foto', kategori: 'Wisuda', color: '#169645', url: '' },
  { id: 2, judul: 'Khataman Al-Qur\'an Santri Tahfizh', tipe: 'foto', kategori: 'Akademik', color: '#0D5C2B', url: '' },
  { id: 3, judul: 'Lomba Cerdas Cermat Kitab Kuning', tipe: 'foto', kategori: 'Perlombaan', color: '#F4B41A', url: '' },
  { id: 4, judul: 'Peringatan Maulid Nabi Muhammad SAW', tipe: 'video', kategori: 'Keagamaan', color: '#169645', url: 'https://youtube.com' },
  { id: 5, judul: 'Gotong Royong Bersih Pesantren', tipe: 'foto', kategori: 'Sosial', color: '#0D5C2B', url: '' },
  { id: 6, judul: 'Ujian Akhir Semester Diniyah & MA', tipe: 'foto', kategori: 'Akademik', color: '#F4B41A', url: '' },
];

export default function GaleriPage() {
  const [galleryList, setGalleryList] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Semua');
  const [type, setType] = useState('Semua');
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState<GaleriItem | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchGaleri()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryList(data);
        } else {
          setGalleryList(FALLBACK_GALLERY as unknown as GaleriItem[]);
        }
      })
      .catch(() => setGalleryList(FALLBACK_GALLERY as unknown as GaleriItem[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = galleryList.filter((g) => {
    const matchCat = category === 'Semua' || g.kategori.toLowerCase() === category.toLowerCase();
    const matchType = type === 'Semua' || (g.tipe || 'foto').toLowerCase() === type.toLowerCase();
    const matchSearch =
      g.judul.toLowerCase().includes(search.toLowerCase()) ||
      (g.deskripsi && g.deskripsi.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/informasi" className="hover:text-white">Informasi</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Galeri Kegiatan</span>
          </nav>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Galeri Dokumentasi Pesantren
          </h1>
          <p className="text-white/70 max-w-2xl">
            Arsip dokumentasi foto dan video beragam kegiatan santri, kajian kitab, upacara, dan fasilitas di PP Al-Fatich.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filters Bar ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari arsip galeri foto/video..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={
                  type === t
                    ? { background: '#0D5C2B', color: '#fff' }
                    : { background: '#f3f4f6', color: '#374151' }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category Pills ── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all"
              style={
                category === c
                  ? { background: '#F4B41A', color: '#1A1A1A', fontWeight: 'bold' }
                  : { background: '#fff', color: '#374151', border: '1px solid #e5e7eb' }
              }
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Gallery Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 h-48 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100">
            Tidak ada item galeri yang sesuai dengan filter pencarian Anda.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setActiveModal(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end"
                style={{
                  aspectRatio: '4/3',
                  background: 'linear-gradient(135deg, #169645, #0D5C2B)',
                }}
              >
                {item.thumbnail || (item.url && item.tipe !== 'video') ? (
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.judul}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-75 transition-opacity pointer-events-none">
                  {item.tipe === 'video' ? (
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play size={24} className="fill-white translate-x-0.5" />
                    </div>
                  ) : (
                    <ImageIcon size={36} className="text-white" />
                  )}
                </div>

                <div className="relative z-10 p-3 sm:p-4">
                  <span className="text-[10px] sm:text-xs font-bold text-yellow-300 uppercase tracking-wider">
                    {item.kategori}
                  </span>
                  <p className="text-white font-bold text-xs sm:text-sm mt-0.5 line-clamp-2 leading-tight">
                    {item.judul}
                  </p>
                </div>

                {item.tipe === 'video' && (
                  <div className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Play size={10} className="fill-white" /> VIDEO
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Lightbox ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-full bg-black aspect-video flex items-center justify-center relative overflow-hidden">
              {activeModal.tipe === 'video' ? (
                <div className="text-center p-6 space-y-3">
                  <Play size={48} className="mx-auto text-yellow-400" />
                  <p className="text-white font-medium text-sm">Pratinjau Video Kegiatan</p>
                  {activeModal.url && (
                    <a
                      href={activeModal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold shadow hover:bg-red-700 transition-colors"
                    >
                      Buka Tautan Video <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ) : activeModal.url || activeModal.thumbnail ? (
                <img
                  src={activeModal.url || activeModal.thumbnail}
                  alt={activeModal.judul}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon size={64} className="text-white/30" />
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full uppercase">
                  {activeModal.kategori}
                </span>
                <span className="text-xs text-gray-400">
                  {activeModal.tanggal ? new Date(activeModal.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{activeModal.judul}</h3>
              {activeModal.deskripsi && (
                <p className="text-sm text-gray-600 leading-relaxed">{activeModal.deskripsi}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
