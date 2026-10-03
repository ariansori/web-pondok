'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scroll, 
  Search, 
  ChevronRight, 
  Calendar, 
  Download, 
  BookOpen, 
  Eye, 
  FileText,
  Tag,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { fetchBahtsu } from '@/lib/api';

type BahtsuItem = {
  id: number;
  judul: string;
  kategori: string;
  tahun: number;
  deskripsi: string;
  file_url?: string;
  download_count?: number;
};

const FALLBACK_BAHTSU: BahtsuItem[] = [
  {
    id: 1,
    judul: 'Hukum Shalat Jum\'at via Live Streaming / Daring',
    kategori: 'Fiqih Ibadah',
    tahun: 2024,
    deskripsi: 'Kajian mendalam mengenai keabsahan shalat Jum\'at yang diikuti secara daring melalui siaran langsung di era teknologi digital berdasarkan syarat ittisalul shufuf dan ittihadul makan.',
    download_count: 148,
  },
  {
    id: 2,
    judul: 'Zakat Saham dan Investasi Digital dalam Perspektif Fiqih Kontemporer',
    kategori: 'Fiqih Muamalat',
    tahun: 2024,
    deskripsi: 'Pembahasan hukum zakat atas kepemilikan saham, reksa dana syariah, dan portofolio aset digital berdasarkan qiyas fiqih klasik terhadap \'Urudhut Tijarah\'.',
    download_count: 215,
  },
  {
    id: 3,
    judul: 'Hukum Jual Beli NFT dan Cryptocurrency dalam Tinjauan Maqashid Syariah',
    kategori: 'Fiqih Muamalat',
    tahun: 2023,
    deskripsi: 'Analisis status hukum mal (harta), mabi\' (komoditas), dan unsur gharar serta spekulasi pada transaksi NFT dan mata uang kripto.',
    download_count: 310,
  },
  {
    id: 4,
    judul: 'Kedudukan Talak yang Diucapkan via Media Digital (SMS/WhatsApp)',
    kategori: 'Fiqih Munakahat',
    tahun: 2023,
    deskripsi: 'Telaah hukum sighat kinayah dan sharih dalam perceraian yang disampaikan melalui pesan singkat elektronik menurut kesepakatan empat mazhab.',
    download_count: 189,
  },
  {
    id: 5,
    judul: 'Hukum Berobat dengan Terapi Gen dan Rekayasa Genetika',
    kategori: 'Fiqih Kedokteran',
    tahun: 2022,
    deskripsi: 'Kajian etika dan hukum Islam terkait batas kebolehan manipulasi DNA dan rekayasa genetik untuk pengobatan penyakit degeneratif.',
    download_count: 172,
  },
];

const CATEGORIES = ['Semua Kategori', 'Fiqih Ibadah', 'Fiqih Muamalat', 'Fiqih Munakahat', 'Fiqih Kedokteran'];
const YEARS = ['Semua Tahun', '2024', '2023', '2022'];

export default function BahtsuMasailPage() {
  const [bahtsuList, setBahtsuList] = useState<BahtsuItem[]>(FALLBACK_BAHTSU);
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedYear, setSelectedYear] = useState('Semua Tahun');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<BahtsuItem | null>(null);

  useEffect(() => {
    fetchBahtsu()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBahtsuList(data);
        }
      })
      .catch(() => {
        // use fallback
      });
  }, []);

  const filtered = bahtsuList.filter((item) => {
    const matchCat = selectedCategory === 'Semua Kategori' || item.kategori === selectedCategory;
    const matchYear = selectedYear === 'Semua Tahun' || item.tahun.toString() === selectedYear;
    const matchSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchYear && matchSearch;
  });

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Header Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/forum" className="hover:text-white transition-colors">Forum</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Bahtsu Masail</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Scroll size={13} />
              Musyawarah Fiqih Kontemporer
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Hasil Bahtsu Masail
          </h1>
          <p className="text-white/80 max-w-2xl text-base sm:text-lg">
            Dokumentasi keputusan sidang bahtsul masail santri dan asatidz PP Salafi Al-Fatich dalam merespons dinamika persoalan umat dengan rujukan kitab turats mu&apos;tabarah.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tema keputusan, hukum, atau kata kunci..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          <div className="flex gap-3 flex-wrap w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold bg-white text-gray-700 focus:outline-none focus:border-green-600"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold bg-white text-gray-700 focus:outline-none focus:border-green-600"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Bahtsu List Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                    {item.kategori}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full flex items-center gap-1">
                    <Calendar size={12} /> Keputusan {item.tahun}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-3 leading-snug"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.judul}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.deskripsi}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Download size={13} />
                  <span>{item.download_count || 120}x diunduh</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModal(item)}
                    className="px-4 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Eye size={14} /> Baca Telaah
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <Scroll size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">Keputusan Bahtsu Masail tidak ditemukan</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Tidak ada arsip musyawarah yang sesuai dengan filter atau kata kunci Anda.
            </p>
          </div>
        )}
      </div>

      {/* ── Modal Baca Telaah Bahtsu ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">
                {activeModal.kategori} &bull; Tahun {activeModal.tahun}
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>
              {activeModal.judul}
            </h2>

            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/50 mb-6">
              <h4 className="text-xs font-extrabold uppercase text-amber-900 mb-2">Ringkasan Masalah (Tashawwurul Mas&apos;alah)</h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                {activeModal.deskripsi}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-extrabold uppercase text-green-800 tracking-wider">Metode & Rujukan Maraji&apos; Kitab</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Keputusan ini dirumuskan berdasarkan musyawarah kubro asatidz Pondok Pesantren Salafi Al-Fatich dengan menelaah ibarat dari kitab-kitab induk mazhab Syafi&apos;i (seperti <em>Tuhfatul Muhtaj, Nihayatul Muhtaj, Al-Majmu&apos; Syarh Al-Muhadzdzab, dan Bugyatul Mustarsyidin</em>).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <a
                href={`https://wa.me/6281758427600?text=${encodeURIComponent(
                  `Assalamu'alaikum, saya ingin meminta salinan PDF dokumen Bahtsu Masail: ${activeModal.judul}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 text-center rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Download size={16} /> Minta Naskah PDF Lengkap
              </a>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
