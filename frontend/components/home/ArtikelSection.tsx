'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react';
import { fetchArtikel, ArtikelItem } from '@/lib/api';
import { formatDateLong, calculateReadingTime } from '@/lib/utils';

export function ArtikelSection() {
  const [artikelList, setArtikelList] = useState<ArtikelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtikel({ limit: 3, published: 'true' })
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setArtikelList(res.data);
        }
      })
      .catch((err) => console.error('Failed to load home articles:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--color-off-white)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header Section ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <span className="badge-green mb-3 inline-block">Literasi Santri</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Khazanah & Artikel
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-2 max-w-2xl">
              Tulisan, kajian fiqih, dan wawasan keislaman terbaru dari Asatidz Pondok Pesantren Al-Fatich.
            </p>
          </div>
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-green-700 font-semibold text-sm hover:bg-green-50 hover:border-green-200 hover:gap-2.5 transition-all shadow-sm"
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        {/* ── Artikel Grid (Max 3) ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
                <div className="w-full h-40 bg-gray-200 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : artikelList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500">
            Belum ada artikel yang diterbitkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {artikelList.map((item) => (
              <Link
                key={item.id}
                href={`/artikel/${item.slug}`}
                className="group bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  {/* Visual Header */}
                  <div
                    className="w-full h-40 rounded-2xl mb-5 flex items-center justify-center text-white relative overflow-hidden shadow-inner"
                    style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <BookOpen size={40} className="text-white/40 group-hover:scale-110 group-hover:text-yellow-300 transition-all duration-300" />
                      </>
                    )}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white tracking-wide uppercase">
                      {item.kategori}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDateLong(item.published_at || item.created_at)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {calculateReadingTime(item.konten || item.ringkasan)} min baca
                    </span>
                  </div>

                  {/* Judul & Ringkasan */}
                  <h3
                    className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-3 line-clamp-2 leading-snug"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {item.ringkasan}
                  </p>
                </div>

                {/* Author & CTA Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                    <div className="w-7 h-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-[11px]">
                      {item.penulis ? item.penulis.charAt(0) : 'A'}
                    </div>
                    <span className="truncate max-w-[130px]">{item.penulis}</span>
                  </div>

                  <span className="text-xs font-bold text-green-700 group-hover:text-green-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Baca <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}