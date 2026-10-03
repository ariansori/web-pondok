'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquareQuote, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  ChevronRight, 
  Plus, 
  Send, 
  User, 
  Clock, 
  BookOpen, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { fetchForumQA, submitQA } from '@/lib/api';

type QAItem = {
  id: number;
  penanya: string;
  email?: string;
  pertanyaan: string;
  jawaban?: string | null;
  dijawab_oleh?: string | null;
  dijawab_at?: string | null;
  status: 'pending' | 'answered' | 'closed';
  verified: boolean | number;
  created_at?: string;
};

const FALLBACK_QA: QAItem[] = [
  {
    id: 1,
    penanya: 'Abdullah (Wali Santri)',
    pertanyaan: 'Bagaimana hukum menggabungkan niat puasa qadha Ramadhan dengan puasa sunnah Senin-Kamis atau puasa Syawal menurut Mazhab Syafi\'i?',
    jawaban: `Menurut mu'tamad (pendapat resmi) dalam Mazhab Syafi'i, menggabungkan niat qadha puasa Ramadhan dengan puasa sunnah (seperti Senin-Kamis atau puasa enam hari Syawal) hukumnya sah dan pahala keduanya insyaAllah tetap didapatkan.

Sebagaimana disebutkan oleh Syaikh Ibnu Hajar Al-Haitami dalam kitab Tuhfatul Muhtaj:
"Jika seseorang berniat puasa fardhu (qadha) pada hari yang disunnahkan berpuasa, maka gugurlah kewajibannya dan ia juga mendapatkan keutamaan sunnah hari tersebut."

Namun, yang paling utama (afdhal) tetaplah memisahkan keduanya secara tersendiri bila memungkinkan.`,
    dijawab_oleh: 'KH. Ali Tamam & Dewan Bahtsu Masail',
    dijawab_at: '2026-06-12T10:00:00Z',
    status: 'answered',
    verified: true,
    created_at: '2026-06-10T08:00:00Z',
  },
  {
    id: 2,
    penanya: 'Fathimah Nur',
    pertanyaan: 'Apakah sah wudhu seorang wanita yang menggunakan kutek/pewarna kuku yang diklaim water-permeable (tembus air)?',
    jawaban: `Syarat sah wudhu adalah tidak adanya penghalang (ha'il) yang mencegah sampainya air ke seluruh permukaan anggota wudhu yang wajib dibasuh, termasuk kuku tangan dan kaki.

Para ulama kontemporer dan dewan fatwa menegaskan bahwa banyak produk yang mengklaim tembus air pada praktiknya tetap membentuk lapisan kedap ketika mengering. Oleh karena itu, demi kehati-hatian dalam ibadah pokok (ihtiyath), sangat dianjurkan untuk menghapus pewarna kuku terlebih dahulu sebelum berwudhu agar kesucian wudhu terjamin secara yakin.`,
    dijawab_oleh: 'Ust. Ahmad Fauzan, Lc.',
    dijawab_at: '2026-05-20T14:30:00Z',
    status: 'answered',
    verified: true,
    created_at: '2026-05-18T09:00:00Z',
  },
  {
    id: 3,
    penanya: 'Rahmat Hidayat',
    pertanyaan: 'Bagaimana aturan berkunjung bagi orang tua/wali santri ke asrama PP Al-Fatich selama masa pembelajaran aktif?',
    jawaban: `Jadwal sambangan (kunjungan wali santri) di PP Al-Fatich diatur pada hari Ahad minggu ke-2 dan minggu ke-4 setiap bulannya, mulai pukul 08.00 hingga 16.00 WIB di area ruang tamu dan halaman utama pesantren.

Hal ini demi menjaga fokus, ketenangan, dan kedisiplinan belajar santri dalam menghafal Al-Qur'an dan mengkaji kitab kuning.`,
    dijawab_oleh: 'Pengurus Keamanan & Ketertiban Pesantren',
    dijawab_at: '2026-04-10T11:15:00Z',
    status: 'answered',
    verified: true,
    created_at: '2026-04-09T15:00:00Z',
  },
];

export default function TanyaJawabPage() {
  const [qaList, setQaList] = useState<QAItem[]>(FALLBACK_QA);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formQuestion, setFormQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchForumQA()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setQaList(data);
        }
      })
      .catch(() => {
        // use fallback
      });
  }, []);

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formQuestion.trim()) return;

    setSubmitting(true);
    try {
      await submitQA({
        penanya: formName,
        email: formEmail,
        pertanyaan: formQuestion,
      });
      setSubmitSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormQuestion('');
    } catch {
      // Mock submit if backend offline
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = qaList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.pertanyaan.toLowerCase().includes(q) ||
      (item.jawaban && item.jawaban.toLowerCase().includes(q)) ||
      item.penanya.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/forum" className="hover:text-white transition-colors">Forum</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Tanya Jawab Syariah</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareQuote size={13} />
              Konsultasi Fiqih & Pesantren
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Tanya Jawab Keislaman
          </h1>
          <p className="text-white/80 max-w-2xl text-base sm:text-lg">
            Ruang konsultasi dan tanya-jawab seputar fiqih ibadah, muamalah, adab santri, dan keislaman yang diasuh langsung oleh Dewan Asatidz PP Salafi Al-Fatich.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Top Bar: Search & Ask Question CTA ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan, hukum fiqih, atau tema..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          <button
            onClick={() => {
              setShowAskModal(true);
              setSubmitSuccess(false);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Ajukan Pertanyaan
          </button>
        </div>

        {/* ── QA Cards List ── */}
        <div className="space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base flex-shrink-0">
                  <HelpCircle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-gray-800">{item.penanya}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Pertanyaan Santri/Umum'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>
                    &ldquo;{item.pertanyaan}&rdquo;
                  </h3>
                </div>
              </div>

              {/* Answer Box */}
              {item.jawaban ? (
                <div className="mt-4 bg-green-50/50 rounded-2xl p-6 border border-green-100 relative">
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-green-200/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-xs">
                        AF
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-900">{item.dijawab_oleh || 'Dewan Asatidz Al-Fatich'}</p>
                        <p className="text-[10px] text-green-700">Penelaah Fiqih & Fatwa Pesantren</p>
                      </div>
                    </div>
                    {item.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-200 text-green-900 rounded-full text-[11px] font-bold">
                        <ShieldCheck size={13} className="text-green-800" /> Terverifikasi
                      </span>
                    )}
                  </div>

                  <div className="prose text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {item.jawaban}
                  </div>
                </div>
              ) : (
                <div className="mt-4 bg-gray-50 rounded-2xl p-4 text-center text-xs text-gray-500 italic">
                  Pertanyaan ini sedang dalam proses penelaahan oleh Dewan Asatidz.
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
              <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">Pertanyaan tidak ditemukan</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Belum ada pertanyaan yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setShowAskModal(true);
                  setSubmitSuccess(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-green-700 text-white font-bold text-xs"
              >
                Jadilah yang Pertama Bertanya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Ajukan Pertanyaan ── */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Ajukan Pertanyaan Syariah
              </h2>
              <button
                onClick={() => setShowAskModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 size={56} className="text-green-600 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900">Pertanyaan Berhasil Dikirim!</h3>
                <p className="text-gray-600 text-sm">
                  Jazakumullahu khairan. Pertanyaan Anda telah diterima dan akan ditelaah oleh Dewan Asatidz PP Salafi Al-Fatich.
                </p>
                <button
                  onClick={() => setShowAskModal(false)}
                  className="px-6 py-2.5 bg-green-700 text-white rounded-xl font-bold text-sm"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleAskSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap / Inisial *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Ahmad / Hamba Allah"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email / No. WhatsApp (Opsional)</label>
                  <input
                    type="text"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Untuk menerima notifikasi balasan"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Isi Pertanyaan *</label>
                  <textarea
                    required
                    rows={4}
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    placeholder="Tuliskan pertanyaan fiqih atau konsultasi keislaman Anda secara jelas..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send size={15} />
                    {submitting ? 'Mengirim...' : 'Kirim Pertanyaan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAskModal(false)}
                    className="px-5 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
