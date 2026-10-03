'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Bookmark, 
  BookOpen, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { fetchArtikelBySlug } from '@/lib/api';
import { FALLBACK_ARTIKEL, ArtikelItem } from '../page';

export default function ArtikelDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artikel, setArtikel] = useState<ArtikelItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // Try fetching from API
    fetchArtikelBySlug(slug)
      .then((data) => {
        if (data && data.judul) {
          setArtikel(data);
        } else {
          // find in fallback
          const found = FALLBACK_ARTIKEL.find((a) => a.slug === slug);
          setArtikel(found || FALLBACK_ARTIKEL[0]);
        }
      })
      .catch(() => {
        const found = FALLBACK_ARTIKEL.find((a) => a.slug === slug);
        setArtikel(found || FALLBACK_ARTIKEL[0]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Terbaru';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const currentItem = artikel || FALLBACK_ARTIKEL[0];
  const relatedArticles = FALLBACK_ARTIKEL.filter((a) => a.slug !== currentItem.slug).slice(0, 3);

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Header / Breadcrumbs ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-12 sm:py-16 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/artikel" className="hover:text-white transition-colors">Artikel</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium truncate max-w-xs">{currentItem.judul}</span>
          </nav>

          <span className="px-3.5 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">
            {currentItem.kategori}
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            {currentItem.judul}
          </h1>

          <div className="flex items-center gap-6 text-sm text-white/80 border-t border-white/10 pt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-xs">
                {currentItem.penulis.charAt(0)}
              </div>
              <span className="font-semibold text-white">{currentItem.penulis}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar size={15} />
              <span>{formatDate(currentItem.published_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Clock size={15} />
              <span>4 Menit Membaca</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-gray-100">
          {/* Summary Quote Box */}
          {currentItem.ringkasan && (
            <div className="bg-green-50/70 border-l-4 border-green-600 p-5 rounded-r-2xl mb-8 text-gray-700 italic text-base leading-relaxed">
              &ldquo;{currentItem.ringkasan}&rdquo;
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 text-base sm:text-lg">
            {currentItem.konten.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 pb-2 border-b border-gray-100"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote
                    key={idx}
                    className="border-l-4 border-yellow-400 bg-amber-50/50 p-4 rounded-r-xl italic text-gray-700 my-4"
                  >
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-line leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {currentItem.tags && (
            <div className="flex items-center gap-2 flex-wrap pt-8 mt-8 border-t border-gray-100">
              <span className="text-xs font-bold uppercase text-gray-400">Kata Kunci:</span>
              {currentItem.tags.split(',').map((tag) => (
                <span
                  key={tag.trim()}
                  className="px-3 py-1 bg-gray-100 hover:bg-green-50 hover:text-green-700 text-gray-600 rounded-full text-xs font-semibold transition-colors"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Share Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-bold text-gray-800 text-sm">Bagikan artikel ini</p>
              <p className="text-gray-500 text-xs">Sebarkan wawasan keislaman dan kebaikan kepada sesama</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${currentItem.judul} - Baca selengkapnya di Web Al-Fatich`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                WhatsApp
              </a>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                {copied ? 'Tersalin!' : 'Salin Tautan'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Author Box ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mt-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-700 to-green-500 text-white flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
            {currentItem.penulis.charAt(0)}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h4 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              {currentItem.penulis}
            </h4>
            <p className="text-xs text-green-700 font-bold mb-2">Dewan Penulis & Pengajar PP Salafi Al-Fatich</p>
            <p className="text-gray-600 text-xs leading-relaxed">
              Berdedikasi dalam penyebaran khazanah keilmuan Islam Ahlussunnah wal Jama&apos;ah dan tradisi keilmuan pesantren.
            </p>
          </div>
        </div>

        {/* ── Related Articles ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Artikel Terkait Lainnya
            </h3>
            <Link
              href="/artikel"
              className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              Lihat Semua Artikel <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/artikel/${rel.slug}`}
                className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-green-700 uppercase">{rel.kategori}</span>
                  <h4
                    className="font-bold text-gray-900 group-hover:text-green-700 transition-colors my-2 line-clamp-2 text-sm leading-snug"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {rel.judul}
                  </h4>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                    {rel.ringkasan}
                  </p>
                </div>
                <div className="text-xs text-gray-400 flex items-center justify-between pt-3 border-t border-gray-100">
                  <span>{formatDate(rel.published_at)}</span>
                  <span className="font-bold text-green-700 group-hover:translate-x-1 transition-transform">Baca →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className="mt-10 text-center">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-bold shadow-sm transition-all hover:scale-105"
          >
            <ArrowLeft size={16} /> Kembali ke Indeks Artikel
          </Link>
        </div>
      </div>
    </div>
  );
}
