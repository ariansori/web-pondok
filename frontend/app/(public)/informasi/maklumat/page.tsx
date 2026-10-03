'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, Search, ChevronRight, Calendar, Eye, Pin } from 'lucide-react';
import { fetchMaklumat, MaklumatItem } from '@/lib/api';

const CATEGORIES = [
  { label: 'Semua', value: 'all' },
  { label: 'Maklumat Resmi', value: 'maklumat' },
  { label: 'Pengumuman', value: 'pengumuman' },
  { label: 'Berita Penting', value: 'berita' },
];

export default function MaklumatPage() {
  const [maklumatList, setMaklumatList] = useState<MaklumatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<MaklumatItem | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchMaklumat()
      .then((data) => {
        if (data) setMaklumatList(data);
      })
      .catch((err) => console.error('Gagal memuat maklumat:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Baru saja';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const filtered = maklumatList.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.kategori === selectedCategory;
    const matchSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.konten.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Banner Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/informasi" className="hover:text-white transition-colors">Informasi</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Maklumat & Pengumuman</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Megaphone size={13} /> Warta Resmi Pesantren
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Maklumat & Pengumuman
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filters & Search ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari surat maklumat atau pengumuman..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={
                  selectedCategory === cat.value
                    ? { background: '#0D5C2B', color: '#ffffff', boxShadow: '0 2px 8px rgba(13,92,43,0.25)' }
                    : { background: '#f3f4f6', color: '#374151' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── List Maklumat ── */}
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton Loader UX
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex gap-2">
                    <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
              Tidak ada maklumat yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            filtered.map((item) => {
              const isPenting = Boolean(item.penting);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${isPenting ? 'border-amber-300 shadow-amber-500/5 bg-gradient-to-r from-amber-50/30 to-white' : 'border-gray-100'
                    }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isPenting && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold flex items-center gap-1">
                            <Pin size={12} className="rotate-45" /> PENTING / UTAMA
                          </span>
                        )}
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          {item.kategori}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={13} />
                          {formatDate(item.published_at || item.created_at)}
                        </span>
                      </div>
                      <h2
                        className="text-xl font-bold text-gray-900 hover:text-green-700 transition-colors cursor-pointer"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                        onClick={() => setActiveModal(item)}
                      >
                        {item.judul}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed whitespace-pre-line">
                        {item.konten}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 flex-shrink-0">
                      <button
                        onClick={() => setActiveModal(item)}
                        className="px-4 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye size={14} /> Baca Maklumat
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Modal Pembaca Surat Maklumat ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="border-b-2 border-green-700 pb-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-lg shadow">AF</div>
                <div>
                  <h3 className="font-bold text-green-800 text-sm uppercase">Pondok Pesantren Salafi Al-Fatich</h3>
                  <p className="text-xs text-gray-500">Sekretariat: Tambak Osowilangun No. 98, Benowo, Surabaya</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">{activeModal.kategori}</span>
              <span className="text-xs text-gray-500 font-medium">Diterbitkan: {formatDate(activeModal.published_at || activeModal.created_at)}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>{activeModal.judul}</h2>
            <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-gray-50/60 p-6 rounded-2xl border border-gray-100 mb-6">
              {activeModal.konten}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <a
                href={`https://wa.me/6281758427600?text=${encodeURIComponent(`Assalamu'alaikum, saya ingin bertanya perihal maklumat: ${activeModal.judul}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 text-center rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm transition-all"
              >
                Tanya Admin via WhatsApp
              </a>
              <button onClick={() => setActiveModal(null)} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}