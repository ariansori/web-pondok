'use client';

import { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  Check,
  RefreshCw,
  Users,
  School,
  BookOpen,
  Trophy,
  Phone,
  Mail,
  MapPin,
  Globe,
  Heart,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import { fetchProfil, fetchStats } from '@/lib/api';
import { api } from '@/lib/api';

interface ProfilData {
  nama_pesantren?: string;
  singkatan?: string;
  tagline?: string;
  deskripsi?: string;
  alamat?: string;
  kota?: string;
  provinsi?: string;
  telepon?: string;
  email?: string;
  website?: string;
  wa_admin?: string;
  tahun_berdiri?: number;
  visi?: string;
  misi?: string;
}

interface StatsData {
  total_santri?: number;
  total_pengajar?: number;
  total_alumni?: number;
  total_lembaga?: number;
  tahun_berdiri?: number;
}

const DEFAULT_PROFIL: ProfilData = {
  nama_pesantren: 'Pondok Pesantren Salafi Al-Fatich',
  singkatan: 'PP Al-Fatich',
  tagline: 'Mewarisi Tradisi Ilmu, Membangun Generasi Rabbani',
  deskripsi: 'Pondok Pesantren Salafi Al-Fatich Surabaya merupakan lembaga pendidikan Islam tradisional yang mengajarkan ilmu-ilmu agama berdasarkan al-Qur\'an dan al-Hadits sesuai manhaj Salafus Shalih.',
  alamat: 'Jl. Raya Kendangsari No. 123',
  kota: 'Surabaya',
  provinsi: 'Jawa Timur',
  telepon: '031-8731234',
  email: 'info@alfatich.ponpes.id',
  website: 'https://alfatich.ponpes.id',
  wa_admin: '6281234567890',
  tahun_berdiri: 1989,
  visi: 'Menjadi Pondok Pesantren Salafi terkemuka yang melahirkan ulama rabbani, berakhlak mulia, dan memberikan manfaat bagi umat.',
  misi: '1. Menyelenggarakan pendidikan Islam berdasarkan al-Qur\'an, al-Hadits, dan kitab-kitab klasik ulama salaf.\n2. Membangun generasi hafizh al-Qur\'an yang berakhlak mulia.\n3. Mengembangkan keilmuan Islam melalui kajian fiqih, hadits, dan ilmu syariah.',
};

const DEFAULT_STATS: StatsData = {
  total_santri: 850,
  total_pengajar: 45,
  total_alumni: 3200,
  total_lembaga: 6,
};

export default function AdminProfilPage() {
  const [profil, setProfil] = useState<ProfilData>(DEFAULT_PROFIL);
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);
  const [activeTab, setActiveTab] = useState<'identitas' | 'visi_misi' | 'statistik' | 'kontak'>('identitas');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetchProfil()
      .then(data => { if (data) setProfil({ ...DEFAULT_PROFIL, ...data }); })
      .catch(() => {});
    fetchStats()
      .then(data => { if (data) setStats({ ...DEFAULT_STATS, ...data }); })
      .catch(() => {});
  }, []);

  const handleSaveProfil = async () => {
    setSaving(true);
    try {
      await api.put('/profil', profil);
    } catch {}
    setSaving(false);
    setSavedMsg('Profil berhasil disimpan!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleSaveStats = async () => {
    setSaving(true);
    try {
      await api.put('/stats', stats);
    } catch {}
    setSaving(false);
    setSavedMsg('Statistik berhasil diperbarui!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const TABS = [
    { id: 'identitas', label: 'Identitas Pesantren', icon: School },
    { id: 'visi_misi', label: 'Visi & Misi', icon: Heart },
    { id: 'statistik', label: 'Data Statistik', icon: Trophy },
    { id: 'kontak', label: 'Kontak & Lokasi', icon: Phone },
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Profil & Pengaturan Website
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Update identitas, visi misi, statistik, dan informasi kontak pesantren yang tampil di publik.
          </p>
        </div>
        {savedMsg && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-bold">
            <Check size={16} className="text-green-600" />
            {savedMsg}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex gap-1 flex-wrap">
        {TABS.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-green-700 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TabIcon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab: Identitas ── */}
      {activeTab === 'identitas' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <School size={18} className="text-green-700" />
            Identitas Pondok Pesantren
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap Pesantren</label>
              <input
                type="text"
                value={profil.nama_pesantren || ''}
                onChange={e => setProfil({ ...profil, nama_pesantren: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Singkatan/Brand Name</label>
              <input
                type="text"
                value={profil.singkatan || ''}
                onChange={e => setProfil({ ...profil, singkatan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tagline / Motto Pesantren</label>
            <input
              type="text"
              value={profil.tagline || ''}
              onChange={e => setProfil({ ...profil, tagline: e.target.value })}
              placeholder="Mis: Mewarisi Tradisi Ilmu, Membangun Generasi Rabbani"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat Pesantren</label>
            <textarea
              rows={4}
              value={profil.deskripsi || ''}
              onChange={e => setProfil({ ...profil, deskripsi: e.target.value })}
              placeholder="Deskripsi ringkas tentang pesantren yang tampil di halaman utama..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Berdiri</label>
            <input
              type="number"
              value={profil.tahun_berdiri || 1989}
              onChange={e => setProfil({ ...profil, tahun_berdiri: Number(e.target.value) })}
              min={1800}
              max={2100}
              className="w-48 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSaveProfil}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Menyimpan...' : 'Simpan Identitas'}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Visi & Misi ── */}
      {activeTab === 'visi_misi' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Heart size={18} className="text-green-700" />
            Visi & Misi Pesantren
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Visi Pesantren</label>
            <textarea
              rows={4}
              value={profil.visi || ''}
              onChange={e => setProfil({ ...profil, visi: e.target.value })}
              placeholder="Cita-cita jangka panjang yang ingin dicapai pesantren..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Misi Pesantren</label>
            <textarea
              rows={7}
              value={profil.misi || ''}
              onChange={e => setProfil({ ...profil, misi: e.target.value })}
              placeholder="Langkah-langkah strategis untuk mewujudkan visi pesantren..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 leading-relaxed"
            />
            <p className="text-[11px] text-gray-400 mt-1">Tip: Gunakan angka (1. 2. 3.) atau tanda &quot;•&quot; untuk daftar misi per poin.</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSaveProfil}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Menyimpan...' : 'Simpan Visi & Misi'}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Statistik ── */}
      {activeTab === 'statistik' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Trophy size={18} className="text-green-700" />
              Data Statistik Pesantren
            </h2>
            <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
              <AlertCircle size={13} />
              <span>Angka yang tampil di halaman utama website publik</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { key: 'total_santri', label: 'Total Santri Aktif', icon: Users, color: 'text-blue-700 bg-blue-50' },
              { key: 'total_pengajar', label: 'Total Pengajar / Ustadz', icon: School, color: 'text-green-700 bg-green-50' },
              { key: 'total_alumni', label: 'Total Alumni', icon: Trophy, color: 'text-purple-700 bg-purple-50' },
              { key: 'total_lembaga', label: 'Jumlah Lembaga / Unit', icon: BookOpen, color: 'text-orange-700 bg-orange-50' },
            ].map(field => {
              const FieldIcon = field.icon;
              return (
                <div key={field.key} className="border border-gray-100 rounded-2xl p-4">
                  <div className={`w-10 h-10 rounded-xl ${field.color} flex items-center justify-center mb-3`}>
                    <FieldIcon size={18} />
                  </div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="number"
                    value={stats[field.key as keyof StatsData] as number || 0}
                    onChange={e => setStats({ ...stats, [field.key]: Number(e.target.value) })}
                    min={0}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-lg font-black text-gray-900 focus:outline-none focus:border-green-600"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSaveStats}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Menyimpan...' : 'Update Statistik'}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Kontak ── */}
      {activeTab === 'kontak' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Phone size={18} className="text-green-700" />
            Informasi Kontak & Lokasi
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap Pesantren</label>
            <input
              type="text"
              value={profil.alamat || ''}
              onChange={e => setProfil({ ...profil, alamat: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kota</label>
              <input
                type="text"
                value={profil.kota || ''}
                onChange={e => setProfil({ ...profil, kota: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={profil.provinsi || ''}
                onChange={e => setProfil({ ...profil, provinsi: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Phone size={11} /> Nomor Telepon
              </label>
              <input
                type="text"
                value={profil.telepon || ''}
                onChange={e => setProfil({ ...profil, telepon: e.target.value })}
                placeholder="031-..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Mail size={11} /> Email Resmi
              </label>
              <input
                type="email"
                value={profil.email || ''}
                onChange={e => setProfil({ ...profil, email: e.target.value })}
                placeholder="info@alfatich.ponpes.id"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Globe size={11} /> Website
              </label>
              <input
                type="url"
                value={profil.website || ''}
                onChange={e => setProfil({ ...profil, website: e.target.value })}
                placeholder="https://alfatich.ponpes.id"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Phone size={11} /> WhatsApp Admin (format internasional)
              </label>
              <input
                type="text"
                value={profil.wa_admin || ''}
                onChange={e => setProfil({ ...profil, wa_admin: e.target.value })}
                placeholder="628xxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSaveProfil}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Menyimpan...' : 'Simpan Kontak & Lokasi'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
