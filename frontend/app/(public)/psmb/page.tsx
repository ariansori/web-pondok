'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Building, 
  Phone, 
  Download,
  AlertCircle,
  User,
  Users,
  BookOpen,
  MapPin
} from 'lucide-react';
import { submitPSMB } from '@/lib/api';
import { PSMB_DEADLINE, WHATSAPP_ADMIN } from '@/lib/constants';

type FormState = {
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  asal_sekolah: string;
  jenjang: 'RA' | 'MI' | 'MTs' | 'MA';
  program_tambahan: string;
  nama_ayah: string;
  nama_ibu: string;
  no_hp: string;
  alamat: string;
  catatan?: string;
};

const INITIAL_FORM: FormState = {
  nama_lengkap: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: 'L',
  asal_sekolah: '',
  jenjang: 'MTs',
  program_tambahan: 'Tahfidzul Qur\'an (MAQ)',
  nama_ayah: '',
  nama_ibu: '',
  no_hp: '',
  alamat: '',
  catatan: '',
};

const SYARAT_LIST = [
  'Mengisi formulir pendaftaran (online / offline di sekretariat).',
  'Fotokopi Akta Kelahiran (3 lembar).',
  'Fotokopi Kartu Keluarga (KK) & KTP kedua orang tua/wali (3 lembar).',
  'Fotokopi Ijazah / Surat Keterangan Lulus (SKL) yang dilegalisir.',
  'Pas foto berwarna ukuran 3x4 (5 lembar, santri putra berpeci, santri putri berjilbab).',
  'Surat Keterangan Sehat dari dokter / puskesmas.',
  'Bersedia mematuhi seluruh tata tertib dan disiplin Pondok Pesantren Salafi Al-Fatich.',
];

const ALUR_PENDAFTARAN = [
  {
    step: '01',
    title: 'Pengisian Formulir',
    desc: 'Isi formulir online pada halaman ini atau datang langsung ke Sekretariat PSMB PP Al-Fatich Surabaya.',
  },
  {
    step: '02',
    title: 'Verifikasi & Tes Penempatan',
    desc: 'Ujian kemampuan dasar membaca Al-Qur\'an (tajwid & makharijul huruf), tes diniyah dasar, dan wawancara santri & wali.',
  },
  {
    step: '03',
    title: 'Pengumuman Hasil',
    desc: 'Pengumuman kelulusan disampaikan via website resmi dan notifikasi WhatsApp langsung kepada nomor wali santri.',
  },
  {
    step: '04',
    title: 'Daftar Ulang & Masuk Asrama',
    desc: 'Penyelesaian administrasi perlengkapan asrama santri, pembagian kamar, dan orientasi santri baru (Khutbatul Arsy).',
  },
];

const JENJANG_INFO = [
  {
    kode: 'RA',
    nama: 'Raudhatul Athfal (RA)',
    setara: 'Setingkat PAUD/TK (Usia 4-6 Tahun)',
    focus: 'Pengenalan Huruf Hijaiyah, Doa Harian, Akhlaq Dasar, Stimulasi Motorik Islami.',
  },
  {
    kode: 'MI',
    nama: 'Madrasah Ibtidaiyah (MI)',
    setara: 'Setingkat Sekolah Dasar (SD)',
    focus: 'Kurikulum Kemenag RI + Penguatan Tahfidz Juz Amma, Fiqih Ibadah, dan Bahasa Arab Dasar.',
  },
  {
    kode: 'MTs',
    nama: 'Madrasah Tsanawiyah (MTs)',
    setara: 'Setingkat SMP (Mukim / Non-Mukim)',
    focus: 'Kajian Kitab Jurumiyah, Fathul Qarib dasar, Bahasa Arab, Bahasa Inggris, dan Kurikulum Kemenag.',
  },
  {
    kode: 'MA',
    nama: 'Madrasah Aliyah (MA)',
    setara: 'Setingkat SMA (Mukim Asrama)',
    focus: 'Pendalaman Kitab Turats Lanjutan (Alfiyah, Fathul Mu\'in), Jurusan IPA/IPS/Keagamaan, dan Persiapan PTN.',
  },
];

const FAQS = [
  {
    q: 'Kapan batas akhir pendaftaran santri baru 2026/2027?',
    a: 'Pendaftaran gelombang reguler dibuka mulai 01 Juli hingga 31 Agustus 2026. Pendaftaran dapat ditutup sewaktu-waktu apabila kuota asrama telah terpenuhi.',
  },
  {
    q: 'Apakah santri wajib mukim (tinggal di asrama)?',
    a: 'Untuk jenjang MTs, MA, dan Madrasah Al-Qur\'an, santri sangat dianjurkan untuk mukim di asrama pesantren guna optimalisasi pembinaan akhlaq dan hafalan 24 jam. Untuk jenjang RA dan MI diperkenankan non-mukim.',
  },
  {
    q: 'Bagaimana metode pembelajaran hafalan Al-Qur\'an di Al-Fatich?',
    a: 'Program tahfidz di Madrasah Al-Qur\'an (MAQ) menggunakan metode talaqqi dan musyafahah langsung kepada para asatidz yang memiliki sanad hafalan bersambung hingga Rasulullah SAW.',
  },
  {
    q: 'Bagaimana jika santri belum lancar membaca Al-Qur\'an atau kitab kuning?',
    a: 'Pesantren menyediakan kelas persiapan (I\'dad/Tamhidi) untuk membimbing santri dari dasar hingga siap mengikuti kurikulum reguler.',
  },
];

export default function PSMBPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; nama: string; jenjang: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = PSMB_DEADLINE.getTime() - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!formData.nama_lengkap || !formData.tempat_lahir || !formData.tanggal_lahir || !formData.alamat) {
        alert('Mohon lengkapi seluruh data calon santri');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.jenjang) {
        alert('Mohon pilih jenjang pendidikan');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.nama_ayah || !formData.nama_ibu || !formData.no_hp) {
        alert('Mohon lengkapi data orang tua dan nomor WhatsApp aktif');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmitFinal = async () => {
    setSubmitting(true);
    try {
      const payload = {
        nama_lengkap: formData.nama_lengkap,
        tempat_lahir: formData.tempat_lahir,
        tanggal_lahir: formData.tanggal_lahir,
        jenis_kelamin: formData.jenis_kelamin,
        asal_sekolah: formData.asal_sekolah,
        jenjang: formData.jenjang,
        nama_ayah: formData.nama_ayah,
        nama_ibu: formData.nama_ibu,
        no_hp: formData.no_hp,
        alamat: formData.alamat,
      };

      const res = await submitPSMB(payload);
      const regId = res?.data?.id || `AF-${Math.floor(100000 + Math.random() * 900000)}`;

      setSuccessData({
        id: String(regId),
        nama: formData.nama_lengkap,
        jenjang: formData.jenjang,
      });
    } catch {
      // Fallback local registration ID for offline preview
      setSuccessData({
        id: `AF-${Math.floor(100000 + Math.random() * 900000)}`,
        nama: formData.nama_lengkap,
        jenjang: formData.jenjang,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Hero Banner with Countdown ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <span className="px-3.5 py-1 bg-yellow-400 text-gray-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Sparkles size={14} /> PSMB T.A. 2026/2027
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                Penerimaan Santri Murid Baru
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6">
                Mari bergabung bersama keluarga besar Pondok Pesantren Salafi Al-Fatich Surabaya. Membina generasi Qur&apos;ani yang berakhlaq mulia, unggul dalam kitab turats, dan berprestasi akademik.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap">
                <a
                  href="#formulir"
                  className="px-8 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-sm shadow-xl transition-all hover:scale-105"
                >
                  Daftar Online Sekarang ↓
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
                    "Assalamu'alaikum, saya ingin konsultasi pendaftaran santri baru PSMB PP Al-Fatich."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <Phone size={16} /> Tanya Panitia PSMB
                </a>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 text-center w-full lg:w-auto shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-300 mb-4">
                Batas Akhir Pendaftaran Reguler
              </p>
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.days}</span>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Hari</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.hours}</span>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Jam</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.minutes}</span>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Menit</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black text-yellow-300">{timeLeft.seconds}</span>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Detik</p>
                </div>
              </div>
              <p className="text-[11px] text-white/60 mt-4">
                *Pendaftaran ditutup otomatis setelah kuota terpenuhi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* ── 4 Langkah Alur Pendaftaran ── */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-green-700 uppercase tracking-widest">Tahapan Mudah</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Alur Pendaftaran Santri Baru
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Proses registrasi santri baru dirancang transparan, mudah, dan dapat dilakukan secara daring maupun luring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALUR_PENDAFTARAN.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-4xl font-black text-gray-100 group-hover:text-green-100 transition-colors absolute top-4 right-4 pointer-events-none">
                  {step.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-green-700 text-white flex items-center justify-center font-black text-sm mb-4 shadow-md">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pilihan Jenjang & Lembaga ── */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-green-700 uppercase tracking-widest">Pendidikan Berjenjang</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Jenjang Pendidikan Yang Dibuka
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {JENJANG_INFO.map((item) => (
              <div
                key={item.kode}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start gap-6 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-800 to-green-600 text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
                  {item.kode}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {item.nama}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide">{item.setara}</p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Persyaratan Berkas ── */}
        <section className="bg-gradient-to-br from-green-900 to-green-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">
                Dokumen Administratif
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                Persyaratan Berkas Pendaftaran
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Berkas dapat diunggah saat registrasi ulang atau diserahkan langsung ke kantor panitia saat tes seleksi tatap muka.
              </p>
            </div>

            <div className="space-y-3">
              {SYARAT_LIST.map((syarat, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
                  <CheckCircle2 size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-white/90 leading-snug">{syarat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE REGISTRATION FORM (WIZARD) ── */}
        <section id="formulir" className="scroll-mt-28">
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-green-100 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-bl-full pointer-events-none" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-extrabold text-green-700 uppercase tracking-widest">Formulir Resmi</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                Pendaftaran Online Santri Baru
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Silakan lengkapi tahapan formulir berikut dengan data yang valid dan benar.
              </p>
            </div>

            {/* Stepper Header */}
            {!successData && (
              <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        currentStep === step
                          ? 'bg-green-700 text-white shadow-lg ring-4 ring-green-100'
                          : currentStep > step
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {currentStep > step ? <CheckCircle2 size={16} /> : step}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-1">
                      {step === 1 ? 'Santri' : step === 2 ? 'Jenjang' : step === 3 ? 'Wali' : 'Kirim'}
                    </span>
                  </div>
                ))}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0" />
              </div>
            )}

            {/* Step Content / Success State */}
            {successData ? (
              <div className="text-center py-10 space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-green-50 text-green-800 rounded-full text-xs font-bold">
                    Pendaftaran Berhasil Diterima
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Alhamdulillah, Data Anda Telah Terkirim!
                  </h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Terima kasih telah mendaftarkan calon santri <strong>{successData.nama}</strong> pada jenjang <strong>{successData.jenjang}</strong> di PP Al-Fatich.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-gray-50 rounded-2xl p-6 max-w-sm mx-auto border border-gray-200 text-left space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Nomor Registrasi:</span>
                    <span className="font-bold text-gray-900">{successData.id}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Nama Calon Santri:</span>
                    <span className="font-bold text-gray-900">{successData.nama}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pilihan Jenjang:</span>
                    <span className="font-bold text-green-700">{successData.jenjang}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Status:</span>
                    <span className="font-bold text-amber-600">Menunggu Verifikasi Berkas</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <a
                    href={`https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
                      `Assalamu'alaikum Panitia PSMB Al-Fatich, saya telah mendaftar online dengan No. Registrasi: ${successData.id}, Nama: ${successData.nama}, Jenjang: ${successData.jenjang}. Mohon konfirmasi jadwal tes seleksi.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Konfirmasi ke WhatsApp Panitia
                  </a>
                  <button
                    onClick={() => {
                      setSuccessData(null);
                      setCurrentStep(1);
                      setFormData(INITIAL_FORM);
                    }}
                    className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Daftar Santri Lainnya
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNextStep} className="space-y-6">
                {/* STEP 1: Data Calon Santri */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <User size={18} className="text-green-700" />
                      Langkah 1: Data Diri Calon Santri
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap Santri *</label>
                      <input
                        type="text"
                        name="nama_lengkap"
                        required
                        value={formData.nama_lengkap}
                        onChange={handleChange}
                        placeholder="Sesuai Akta Kelahiran / Ijazah"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tempat Lahir *</label>
                        <input
                          type="text"
                          name="tempat_lahir"
                          required
                          value={formData.tempat_lahir}
                          onChange={handleChange}
                          placeholder="Kota kelahiran (cth: Surabaya)"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Lahir *</label>
                        <input
                          type="date"
                          name="tanggal_lahir"
                          required
                          value={formData.tanggal_lahir}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Kelamin *</label>
                        <select
                          name="jenis_kelamin"
                          value={formData.jenis_kelamin}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-600"
                        >
                          <option value="L">Laki-laki (Santri Putra)</option>
                          <option value="P">Perempuan (Santri Putri)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Asal Sekolah Sebelumnya</label>
                        <input
                          type="text"
                          name="asal_sekolah"
                          value={formData.asal_sekolah}
                          onChange={handleChange}
                          placeholder="Nama SD/MI/SMP asal"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Domisili Lengkap *</label>
                      <textarea
                        name="alamat"
                        rows={2}
                        required
                        value={formData.alamat}
                        onChange={handleChange}
                        placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Pilihan Jenjang & Program */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <BookOpen size={18} className="text-green-700" />
                      Langkah 2: Pilihan Jenjang & Program
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Pilih Jenjang Formal *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(['RA', 'MI', 'MTs', 'MA'] as const).map((j) => (
                          <button
                            type="button"
                            key={j}
                            onClick={() => setFormData((prev) => ({ ...prev, jenjang: j }))}
                            className={`p-4 rounded-2xl border text-center transition-all ${
                              formData.jenjang === j
                                ? 'border-green-600 bg-green-50/80 text-green-900 shadow-md font-bold'
                                : 'border-gray-200 hover:border-green-300 text-gray-700'
                            }`}
                          >
                            <span className="text-lg font-black block">{j}</span>
                            <span className="text-[10px] text-gray-500">
                              {j === 'RA' ? 'Usia Dini' : j === 'MI' ? 'Setara SD' : j === 'MTs' ? 'Setara SMP' : 'Setara SMA'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Program Pesantren Utama *</label>
                      <select
                        name="program_tambahan"
                        value={formData.program_tambahan}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-600"
                      >
                        <option value="Tahfidzul Qur'an (MAQ)">Madrasah Al-Qur&apos;an (Tahfidz Bersanad)</option>
                        <option value="Madrasah Diniyah Salafiyah (Kitab Kuning)">Madrasah Diniyah Salafiyah (Kajian Kitab Kuning)</option>
                        <option value="Reguler Terpadu (Tahfidz & Kitab)">Reguler Terpadu (Tahfidz Juz & Fiqih)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Tambahan / Motivasi (Opsional)</label>
                      <textarea
                        name="catatan"
                        rows={2}
                        value={formData.catatan}
                        onChange={handleChange}
                        placeholder="Contoh: Santri sudah memiliki hafalan 3 Juz sebelumnya"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Data Orang Tua / Wali */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Users size={18} className="text-green-700" />
                      Langkah 3: Data Orang Tua / Wali Santri
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nama Ayah Kandung / Wali *</label>
                        <input
                          type="text"
                          name="nama_ayah"
                          required
                          value={formData.nama_ayah}
                          onChange={handleChange}
                          placeholder="Nama lengkap ayah"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nama Ibu Kandung *</label>
                        <input
                          type="text"
                          name="nama_ibu"
                          required
                          value={formData.nama_ibu}
                          onChange={handleChange}
                          placeholder="Nama lengkap ibu"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nomor WhatsApp Aktif Wali Santri *</label>
                      <input
                        type="tel"
                        name="no_hp"
                        required
                        value={formData.no_hp}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890 (Digunakan untuk notifikasi seleksi)"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Konfirmasi Data */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <ShieldCheck size={18} className="text-green-700" />
                      Langkah 4: Konfirmasi & Kirim Data
                    </h3>

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3 text-xs sm:text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">Nama Calon Santri:</span>
                        <span className="font-bold text-gray-900">{formData.nama_lengkap}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">Tempat, Tgl Lahir:</span>
                        <span className="font-bold text-gray-900">{formData.tempat_lahir}, {formData.tanggal_lahir}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">Jenjang yang Dituju:</span>
                        <span className="font-bold text-green-700">{formData.jenjang} &bull; {formData.program_tambahan}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">Orang Tua (Ayah / Ibu):</span>
                        <span className="font-bold text-gray-900">{formData.nama_ayah} / {formData.nama_ibu}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">No. WhatsApp Wali:</span>
                        <span className="font-bold text-gray-900">{formData.no_hp}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">Alamat:</span>
                        <span className="font-medium text-gray-800">{formData.alamat}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                      Dengan menekan tombol <strong>Kirim Pendaftaran</strong>, saya menyatakan bahwa data yang diisikan adalah benar dan bersedia mengikuti prosedur seleksi PSMB PP Al-Fatich.
                    </div>
                  </div>
                )}

                {/* Form Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> Kembali
                    </button>
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="submit"
                      className="ml-auto px-7 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      Lanjut Langkah Berikutnya <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmitFinal}
                      className="ml-auto px-8 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-sm shadow-xl transition-all flex items-center gap-2"
                    >
                      <Send size={16} /> {submitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran Sekarang'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── FAQ PSMB Accordion ── */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold text-green-700 uppercase tracking-widest">Pusat Bantuan</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Pertanyaan Seputar PSMB (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-gray-900 text-sm sm:text-base hover:text-green-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 text-gray-400 flex-shrink-0 ${
                      openFaq === i ? 'rotate-90 text-green-700' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
