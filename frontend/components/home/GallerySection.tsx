'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Image as ImageIcon, Play, ChevronRight } from 'lucide-react';
import { fetchGaleri, GaleriItem } from '@/lib/api';

const DEFAULT_GALLERY = [
  { id: 1, judul: 'Haflah Akhirussanah 2025', tipe: 'foto', kategori: 'Wisuda', url: '' },
  { id: 2, judul: 'Kegiatan Tahfidz Santri', tipe: 'foto', kategori: 'Akademik', url: '' },
  { id: 3, judul: 'Lomba Cerdas Cermat', tipe: 'foto', kategori: 'Perlombaan', url: '' },
  { id: 4, judul: 'Maulid Nabi 1446H', tipe: 'video', kategori: 'Keagamaan', url: '' },
  { id: 5, judul: 'Gotong Royong Pesantren', tipe: 'foto', kategori: 'Sosial', url: '' },
  { id: 6, judul: 'Ujian Akhir Semester', tipe: 'foto', kategori: 'Akademik', url: '' },
];

const FILTERS = ['Semua', 'Foto', 'Video'];
const GRADIENTS = [
  'linear-gradient(135deg, #169645, #0D5C2B)',
  'linear-gradient(135deg, #0D5C2B, #072a14)',
  'linear-gradient(135deg, #D4970E, #F4B41A)',
  'linear-gradient(135deg, #169645, #0D5C2B)',
  'linear-gradient(135deg, #0D5C2B, #072a14)',
  'linear-gradient(135deg, #D4970E, #F4B41A)',
];

export function GallerySection() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [active, setActive] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGaleri({ limit: 6 })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(DEFAULT_GALLERY as GaleriItem[]);
        }
      })
      .catch(() => setItems(DEFAULT_GALLERY as GaleriItem[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === 'Semua'
    ? items
    : items.filter(item => (item.tipe || 'foto').toLowerCase() === active.toLowerCase());

  return (
    <section id="galeri" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-gold mb-3 inline-block">Dokumentasi</span>
            <h2 className="section-title">Galeri Kegiatan</h2>
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={active === f
                  ? { background: '#169645', color: '#fff' }
                  : { background: '#F0FFF4', color: '#169645' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden card-hover cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              style={{
                aspectRatio: i === 0 ? '16/9' : '4/3',
                background: item.thumbnail || item.url ? '#0D5C2B' : GRADIENTS[i % GRADIENTS.length],
              }}
            >
              {item.thumbnail || (item.url && item.tipe !== 'video') ? (
                <img
                  src={item.thumbnail || item.url}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : null}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none">
                {item.tipe === 'video'
                  ? <Play size={48} className="text-white fill-white" />
                  : <ImageIcon size={48} className="text-white" />}
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wide">{item.kategori}</span>
                <p className="text-white font-bold text-sm mt-0.5 line-clamp-2">{item.judul}</p>
              </div>

              {/* Video badge */}
              {item.tipe === 'video' && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <Play size={10} className="fill-white" /> VIDEO
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/informasi/galeri" className="btn-green inline-flex">
            Lihat Galeri Lengkap <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
