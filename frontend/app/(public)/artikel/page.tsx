'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Share2
} from 'lucide-react';
import { fetchArtikel } from '@/lib/api';

export type ArtikelItem = {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  ringkasan: string;
  penulis: string;
  kategori: string;
  published: boolean;
  published_at?: string;
  view_count?: number;
  tags?: string;
};

export const FALLBACK_ARTIKEL: ArtikelItem[] = [
  {
    id: 1,
    judul: 'Metode Talaqqi: Warisan Sanad Keilmuan Islam yang Tak Lekang Waktu',
    slug: 'metode-talaqqi-warisan-sanad-keilmuan-islam',
    ringkasan: 'Talaqqi adalah metode transmisi pembelajaran Al-Qur\'an secara langsung face-to-face antara guru dan murid yang telah menjadi tulang punggung peradaban Islam sejak zaman Rasulullah SAW.',
    konten: `Talaqqi dan musyafahah adalah metode pembelajaran Al-Qur'an secara langsung face-to-face antara guru yang bersanad (mujaz) dengan murid. Metode ini bukan sekadar proses belajar membaca, melainkan proses transfer berkah, adab, ketelitian makharijul huruf, dan sifat-sifat huruf hijaiyah secara autentik.

Di Pondok Pesantren Salafi Al-Fatich Surabaya, metode talaqqi diterapkan sebagai standar utama dalam pengajaran Al-Qur'an di Madrasah Al-Qur'an (MAQ). Setiap santri mendapatkan bimbingan langsung dari ustadz yang memiliki sanad qira'ah bersambung hingga Rasulullah SAW.

### Keutamaan Sanad dalam Pembelajaran Al-Qur'an
Imam Abdullah bin Mubarak rahimahullah berkata:
> "Sanad itu bagian dari agama. Seandainya tidak ada sanad, niscaya siapa saja bisa berkata apa saja yang dia kehendaki."

Dengan metode talaqqi, keaslian pelafalan Al-Qur'an tetap terjaga secara mutawatir dari generasi ke generasi tanpa ada perubahan sedikit pun. Santri tidak hanya dituntut hafal secara lafazh, namun juga memahami tajwid, waqaf wal ibtida', serta nilai-nilai akhlaq Al-Qur'an dalam kehidupan sehari-hari.`,
    penulis: 'Ust. Ahmad Fauzan, Lc.',
    kategori: 'Pendidikan',
    published: true,
    published_at: '2026-08-10T10:00:00Z',
    view_count: 342,
    tags: 'Talaqqi, Tahfidz, Sanad, MAQ',
  },
  {
    id: 2,
    judul: 'Pentingnya Kitab Kuning dalam Pembentukan Faqih yang Komprehensif',
    slug: 'pentingnya-kitab-kuning-pembentukan-faqih',
    ringkasan: 'Kitab kuning (turats) merupakan warisan intelektual ulama terdahulu yang tak ternilai dan menjadi pondasi utama santri di pesantren salafi.',
    konten: `Kitab kuning atau kitab turats merupakan warisan intelektual ulama mu'tabarah yang telah teruji melintasi zaman. Di pesantren salafi seperti PP Al-Fatich, kajian kitab kuning bukan sekadar mata pelajaran, melainkan instrumen utama dalam membentuk nalar santri yang faqih—yakni memahami agama secara mendalam, moderat (tawassuth), dan kontekstual.

### Kurikulum Kitab di PP Al-Fatich
Jenjang kajian kitab di Al-Fatich mencakup berbagai disiplin ilmu pokok:
- **Fiqih & Ushul Fiqih:** Mulai dari Safinatun Najah, Sullamut Taufiq, Fathul Qarib, hingga Fathul Mu'in dan Ghayatul Wushul.
- **Gramatika Arab (Al-Alat):** Jurumiyah, Imrithi, hingga Alfiyah Ibn Malik.
- **Tasawwuf & Akhlaq:** Bidayatul Hidayah, Ihya' Ulumiddin, dan Ta'limul Muta'allim.
- **Hadits & Tafsir:** Riyadhus Shalihin, Bulughul Maram, dan Tafsir Jalalain.

Dengan menguasai metodologi pembacaan kitab kuning, santri memiliki benteng epistemologis yang kokoh sehingga tidak mudah terombang-ambing oleh pemikiran-pemikiran instan yang dangkal.`,
    penulis: 'KH. Ali Tamam bin Mu\'abih',
    kategori: 'Keislaman',
    published: true,
    published_at: '2026-07-25T14:30:00Z',
    view_count: 512,
    tags: 'Turats, Fiqih, Kitab Kuning, Salafi',
  },
  {
    id: 3,
    judul: 'Akhlaq sebagai Pondasi Utama Pendidikan di PP Al-Fatich',
    slug: 'akhlaq-pondasi-utama-pendidikan-al-fatich',
    ringkasan: 'Pembinaan akhlaq di PP Al-Fatich bukan sekadar pelajaran kelas, melainkan kehidupan nyata 24 jam sehari yang membentuk kepribadian sejati.',
    konten: `Imam Al-Ghazali mendefinisikan akhlaq sebagai "keadaan jiwa yang tertanam kuat, yang darinya terpancar perbuatan-perbuatan dengan mudah tanpa memerlukan pertimbangan yang berbelit-belit".

Di PP Al-Fatich, pembinaan adab senantiasa didahulukan sebelum ilmu. Sebagaimana nasihat Imam Malik kepada pemuda Quraisy: "Pelajarilah adab sebelum engkau mempelajari ilmu."

### Penerapan Adab dalam Keseharian Santri
1. **Adab terhadap Guru (Ta'dhimul Ustadz):** Berjalan di belakang kiai, tawadhu' saat menerima pengajaran, dan menjaga keikhlasan niat.
2. **Adab terhadap Sesama Santri:** Menjunjung tinggi ukhuwah islamiyah, saling tolong-menolong dalam kebaikan, dan menjauhi permusuhan.
3. **Adab terhadap Waktu dan Ibadah:** Disiplin shalat berjamaah awal waktu, melazimi wirid ba'da shalat, serta bangun di sepertiga malam untuk qiyamul lail.`,
    penulis: 'Ny. Hj. Nah\'ah binti Mbah H. Sa\'id',
    kategori: 'Pendidikan',
    published: true,
    published_at: '2026-07-05T09:15:00Z',
    view_count: 289,
    tags: 'Adab, Karakter, Akhlaq, Pesantren',
  },
  {
    id: 4,
    judul: 'Moderasi Beragama (Wasathiyyah): Pandangan Santri Salafi',
    slug: 'moderasi-beragama-wasathiyyah-santri-salafi',
    ringkasan: 'Menjaga keseimbangan antara keteguhan memegang syariat dengan keluwesan berinteraksi sosial di tengah kemajemukan bangsa.',
    konten: `Prinsip Ahlussunnah wal Jama'ah senantiasa berpijak pada empat pilar: Tawassuth (moderat), Tawazun (seimbang), I'tidal (lurus/adil), dan Tasamuh (toleran).

Pondok Pesantren Al-Fatich mendidik para santri untuk senantiasa teguh dalam aqidah dan syariah, namun santun, ramah, dan menjadi perekat persatuan di tengah kehidupan bermasyarakat, berbangsa, dan bernegara.`,
    penulis: 'Dewan Asatidz PP Al-Fatich',
    kategori: 'Keislaman',
    published: true,
    published_at: '2026-06-20T16:00:00Z',
    view_count: 420,
    tags: 'Wasathiyyah, Aswaja, Toleransi, Kebangsaan',
  },
];

const CATEGORIES = ['Semua', 'Pendidikan', 'Keislaman', 'Fiqih', 'Santri'];

export default function ArtikelListPage() {
  const [artikelList, setArtikelList] = useState<ArtikelItem[]>(FALLBACK_ARTIKEL);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArtikel()
      .then((res) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          setArtikelList(res.data);
        }
      })
      .catch(() => {
        // fallback
      });
  }, []);

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

  const filtered = artikelList.filter((a) => {
    const matchCat = selectedCategory === 'Semua' || a.kategori.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      a.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.penulis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0] || FALLBACK_ARTIKEL[0];
  const regularList = filtered.length > 1 ? filtered.slice(1) : filtered;

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Artikel & Wawasan</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={13} />
              Literasi Keislaman
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Artikel & Khazanah Ilmu
          </h1>
          <p className="text-white/80 max-w-2xl text-base sm:text-lg">
            Kumpulan tulisan kajian fiqih, tadabbur Al-Qur&apos;an, pengasuhan santri, serta wawasan keislaman dari Masyayikh dan Asatidz PP Al-Fatich.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Search & Filter Controls ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul artikel, topik, atau nama penulis..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={
                  selectedCategory === cat
                    ? { background: '#169645', color: '#ffffff', boxShadow: '0 2px 8px rgba(22,150,69,0.25)' }
                    : { background: '#f3f4f6', color: '#374151' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Featured Article Hero Card (if search is empty and first item exists) ── */}
        {searchQuery === '' && selectedCategory === 'Semua' && featured && (
          <div className="mb-12">
            <Link
              href={`/artikel/${featured.slug}`}
              className="group block bg-gradient-to-br from-green-900 to-green-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="max-w-3xl relative z-10 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={12} /> Artikel Pilihan
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                    {featured.kategori}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight group-hover:text-yellow-300 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {featured.judul}
                </h2>

                <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featured.ringkasan}
                </p>

                <div className="flex items-center gap-6 pt-4 text-xs text-white/70 border-t border-white/10 flex-wrap">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-yellow-400" />
                    <span className="font-semibold text-white">{featured.penulis}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(featured.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>5 Menit Baca</span>
                  </div>
                  <div className="ml-auto inline-flex items-center gap-1 font-bold text-yellow-300 group-hover:translate-x-1 transition-transform">
                    <span>Baca Lengkap</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── Articles Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(searchQuery === '' && selectedCategory === 'Semua' ? regularList : filtered).map((item) => (
            <Link
              key={item.id}
              href={`/artikel/${item.slug}`}
              className="group bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Gradient Header */}
                <div 
                  className="w-full h-36 rounded-2xl mb-5 flex items-center justify-center text-white relative overflow-hidden shadow-inner"
                  style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <BookOpen size={36} className="text-white/40 group-hover:scale-110 group-hover:text-yellow-300 transition-all duration-300" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white">
                    {item.kategori}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar size={13} />
                  <span>{formatDate(item.published_at)}</span>
                  <span>•</span>
                  <Clock size={13} />
                  <span>4 min baca</span>
                </div>

                <h3
                  className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-3 line-clamp-2 leading-snug"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.judul}
                </h3>

                <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-6">
                  {item.ringkasan}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-[10px]">
                    {item.penulis.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px]">{item.penulis}</span>
                </div>

                <span className="text-xs font-bold text-green-700 group-hover:text-green-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Baca <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm mt-4">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">Artikel tidak ditemukan</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Tidak ada artikel yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
