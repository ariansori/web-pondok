'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  Megaphone, 
  MessageSquareQuote, 
  Scroll, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  TrendingUp,
  Users,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { fetchAdminStats, fetchPSMBList, updatePSMBStatus, fetchForumQA } from '@/lib/api';
import { getStoredAuth, AdminUser, isSuperAdmin } from '@/lib/auth';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState({
    totalPSMB: 48,
    pendingPSMB: 14,
    totalArtikel: 12,
    totalAgenda: 8,
    totalMaklumat: 6,
    totalQA: 15,
    pendingQA: 3,
    totalBahtsu: 7,
  });

  const [recentPSMB, setRecentPSMB] = useState<any[]>([
    { id: 101, nama_lengkap: 'Muhammad Raihan', jenjang: 'MTs', no_hp: '081234567891', status: 'pending', created_at: '2026-08-01' },
    { id: 102, nama_lengkap: 'Aisyah Humaira', jenjang: 'MA', no_hp: '081234567892', status: 'diterima', created_at: '2026-07-28' },
    { id: 103, nama_lengkap: 'Fathur Rahman', jenjang: 'MI', no_hp: '081234567893', status: 'pending', created_at: '2026-07-25' },
    { id: 104, nama_lengkap: 'Nurul Hidayah', jenjang: 'RA', no_hp: '081234567894', status: 'diterima', created_at: '2026-07-20' },
  ]);

  const [pendingQA, setPendingQA] = useState<any[]>([
    { id: 1, penanya: 'Abdullah (Wali Santri)', pertanyaan: 'Bagaimana hukum menggabungkan niat puasa qadha Ramadhan dengan puasa sunnah?', status: 'answered' },
    { id: 2, penanya: 'Fathimah Nur', pertanyaan: 'Apakah sah wudhu seorang wanita yang menggunakan kutek water-permeable?', status: 'pending' },
  ]);

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth) setUser(auth);

    // Fetch live dashboard stats
    fetchAdminStats()
      .then((data) => {
        if (data) setStats(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});

    // Fetch live PSMB list
    fetchPSMBList()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecentPSMB(data.slice(0, 5));
        }
      })
      .catch(() => {});

    // Fetch live QA list
    fetchForumQA()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPendingQA(data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: 'pending' | 'diterima' | 'ditolak') => {
    try {
      await updatePSMBStatus(id, newStatus);
      setRecentPSMB(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch {
      setRecentPSMB(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const isSuper = isSuperAdmin(user);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* ── Welcome Header Card ── */}
      <div className="bg-gradient-to-r from-[#072a14] via-[#0D5C2B] to-[#169645] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-400 text-gray-950 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow">
              <Sparkles size={13} />
              {isSuper ? 'Hak Akses Super Admin Penuh' : 'Hak Akses Editor Konten'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ahlan wa Sahlan, {user?.nama || 'Admin Al-Fatich'}!
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Selamat datang di Pusat Kontrol Administrasi Pondok Pesantren Salafi Al-Fatich Surabaya. Kelola seluruh postingan, pendaftaran santri baru, maklumat pengasuh, dan tanya jawab syariah dari sini.
          </p>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Pendaftar PSMB', value: stats.totalPSMB, sub: `${stats.pendingPSMB} Menunggu`, href: '/admin/psmb', icon: GraduationCap, color: '#169645' },
          { label: 'Artikel & Berita', value: stats.totalArtikel, sub: 'Publikasi Aktif', href: '/admin/artikel', icon: BookOpen, color: '#0D5C2B' },
          { label: 'Agenda & Acara', value: stats.totalAgenda, sub: 'Jadwal Pesantren', href: '/admin/agenda', icon: CalendarDays, color: '#F4B41A' },
          { label: 'Maklumat Resmi', value: stats.totalMaklumat, sub: 'Warta Pesantren', href: '/admin/maklumat', icon: Megaphone, color: '#169645' },
          { label: 'Tanya Jawab', value: stats.totalQA, sub: `${stats.pendingQA} Butuh Jawaban`, href: '/admin/forum-qa', icon: MessageSquareQuote, color: '#0D5C2B' },
          { label: 'Bahtsu Masail', value: stats.totalBahtsu, sub: 'Hasil Musyawarah', href: '/admin/bahtsu-masail', icon: Scroll, color: '#F4B41A' },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              href={m.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform"
                  style={{ background: m.color }}
                >
                  <Icon size={18} />
                </div>
                <span className="text-2xl font-black text-gray-900 group-hover:text-green-700 transition-colors">
                  {m.value}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{m.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{m.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Quick Action Buttons ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">Pintasan Cepat Pembuatan Konten</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/artikel"
            className="p-3.5 rounded-2xl bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Plus size={16} className="text-green-700" /> Tulis Artikel Baru
          </Link>
          <Link
            href="/admin/agenda"
            className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Plus size={16} className="text-amber-700" /> Tambah Agenda
          </Link>
          <Link
            href="/admin/maklumat"
            className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Plus size={16} className="text-blue-700" /> Buat Maklumat
          </Link>
          <Link
            href="/admin/psmb"
            className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <GraduationCap size={16} className="text-purple-700" /> Review PSMB
          </Link>
        </div>
      </div>

      {/* ── 2 Main Widgets: Recent PSMB & Q&A Pending ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Widget 1: Recent PSMB Registrations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Pendaftar PSMB Terbaru
                </h3>
                <p className="text-xs text-gray-500">Santri yang mendaftar secara online</p>
              </div>
              <Link href="/admin/psmb" className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
                Kelola Semua <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentPSMB.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{item.nama_lengkap}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        {item.jenjang}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">WA: {item.no_hp}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border transition-colors cursor-pointer ${
                        item.status === 'diterima'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : item.status === 'ditolak'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="diterima">Diterima</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-6 text-center">
            <Link href="/admin/psmb" className="text-xs font-bold text-green-700 hover:underline">
              Buka Halaman Data Lengkap Santri PSMB →
            </Link>
          </div>
        </div>

        {/* Widget 2: Recent Q&A Pending */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Konsultasi Fiqih / Q&A Masuk
                </h3>
                <p className="text-xs text-gray-500">Pertanyaan santri dan wali yang butuh jawaban asatidz</p>
              </div>
              <Link href="/admin/forum-qa" className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {pendingQA.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">{item.penanya}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status === 'answered' ? 'Terjawab' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 italic">
                    &ldquo;{item.pertanyaan}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-6 text-center">
            <Link href="/admin/forum-qa" className="text-xs font-bold text-green-700 hover:underline">
              Jawab Pertanyaan Konsultasi di Forum Q&A →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
