'use client';

import { useState, useEffect } from 'react';
import {
  Scroll,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  FileText,
  Calendar,
  ExternalLink,
  BookOpen,
  Check,
} from 'lucide-react';
import { fetchBahtsu, createBahtsu, updateBahtsu, deleteBahtsu } from '@/lib/api';

interface BahtsuItem {
  id: number;
  judul: string;
  tahun: number;
  tashawwur: string;
  hukum: string;
  dalil?: string;
  referensi?: string;
  file_url?: string;
  created_at?: string;
}

const FALLBACK_BAHTSU: BahtsuItem[] = [
  {
    id: 1,
    judul: 'Hukum Penggunaan Aplikasi Digital untuk Transaksi Keuangan Syariah',
    tahun: 2025,
    tashawwur: 'Penggunaan fintech dan aplikasi dompet digital (e-wallet) dalam transaksi sehari-hari yang kian marak di kalangan santri dan masyarakat.',
    hukum: 'Hukumnya boleh (mubah) dengan syarat tidak mengandung unsur riba, gharar, dan maysir serta digunakan untuk transaksi yang halal.',
    dalil: 'QS. Al-Baqarah: 275, QS. An-Nisa: 29',
    referensi: 'Fathul Wahhab, I\'anah al-Talibin, Majmu\' Fatawa',
    created_at: '2026-05-15T00:00:00Z',
  },
  {
    id: 2,
    judul: 'Kedudukan Hukum Wakaf Produktif dalam Fiqih Mu\'amalah Kontemporer',
    tahun: 2024,
    tashawwur: 'Wakaf produktif adalah wakaf yang dikelola secara produktif untuk menghasilkan manfaat/keuntungan yang kemudian didistribusikan kepada beneficiary.',
    hukum: 'Hukumnya diperbolehkan berdasarkan kaidah maslahah mursalah dan ijtihad ulama kontemporer, dengan tetap menjaga keabadian aset wakaf.',
    dalil: 'Hadis Umar bin Khattab tentang wakaf (HR. Bukhari-Muslim)',
    referensi: 'Mughnil Muhtaj, Al-Umm Imam Syafi\'i',
    created_at: '2025-09-20T00:00:00Z',
  },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function AdminBahtsuMasailPage() {
  const [bahtsuList, setBahtsuList] = useState<BahtsuItem[]>([]);
  const [search, setSearch] = useState('');
  const [tahunFilter, setTahunFilter] = useState<string>('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BahtsuItem | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    tahun: CURRENT_YEAR,
    tashawwur: '',
    hukum: '',
    dalil: '',
    referensi: '',
    file_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBahtsu()
      .then(data => {
        if (Array.isArray(data)) setBahtsuList(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ judul: '', tahun: CURRENT_YEAR, tashawwur: '', hukum: '', dalil: '', referensi: '', file_url: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: BahtsuItem) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      tahun: item.tahun,
      tashawwur: item.tashawwur,
      hukum: item.hukum,
      dalil: item.dalil || '',
      referensi: item.referensi || '',
      file_url: item.file_url || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus dokumen Bahtsu Masail ini?')) return;
    try { await deleteBahtsu(id); } catch {}
    setBahtsuList(prev => prev.filter(b => b.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.tashawwur || !formData.hukum) return;

    setSaving(true);
    if (editingItem) {
      try { await updateBahtsu(editingItem.id, formData); } catch {}
      setBahtsuList(prev => prev.map(b => b.id === editingItem.id ? { ...b, ...formData } : b));
    } else {
      const newItem: BahtsuItem = {
        id: Date.now(),
        ...formData,
        created_at: new Date().toISOString(),
      };
      try { await createBahtsu(formData); } catch {}
      setBahtsuList(prev => [newItem, ...prev]);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const availableTahun = ['Semua', ...Array.from(new Set(bahtsuList.map(b => String(b.tahun)))).sort((a, b) => Number(b) - Number(a))];

  const filtered = bahtsuList.filter(b => {
    const matchTahun = tahunFilter === 'Semua' || String(b.tahun) === tahunFilter;
    const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.tashawwur.toLowerCase().includes(search.toLowerCase());
    return matchTahun && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Bahtsu Masail — Keputusan Musyawarah
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola dokumen keputusan musyawarah fiqih tahunan Pondok Pesantren Al-Fatich.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Tambah Keputusan Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Keputusan', value: bahtsuList.length },
          { label: 'Tahun Sidang', value: [...new Set(bahtsuList.map(b => b.tahun))].length },
          { label: 'Tahun Terbaru', value: Math.max(...bahtsuList.map(b => b.tahun)) || '-' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-black text-green-800">{s.value}</p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul atau tashawwur mas'alah..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {availableTahun.map(t => (
            <button
              key={t}
              onClick={() => setTahunFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tahunFilter === t ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bahtsu Cards */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Tahun badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-green-700 text-white text-xs font-black rounded-full flex items-center gap-1">
                      <Calendar size={10} />
                      Musyawarah {item.tahun}
                    </span>
                    {item.file_url && (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1 hover:bg-blue-100 transition-colors"
                      >
                        <FileText size={10} />
                        Unduh PDF
                      </a>
                    )}
                  </div>

                  {/* Judul */}
                  <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug">{item.judul}</h3>

                  {/* Tashawwur */}
                  <div className="mb-3">
                    <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-1">Tashawwurul Mas&#39;alah</p>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{item.tashawwur}</p>
                  </div>

                  {/* Hukum */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-3 mb-3">
                    <p className="text-[11px] font-black uppercase text-green-700 tracking-wider mb-1">Keputusan / Hukum</p>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">{item.hukum}</p>
                  </div>

                  {/* Dalil & Referensi */}
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    {item.dalil && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <BookOpen size={11} className="text-green-600" />
                        <span className="font-semibold">Dalil:</span> <span>{item.dalil}</span>
                      </div>
                    )}
                    {item.referensi && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Scroll size={11} className="text-green-600" />
                        <span className="font-semibold">Referensi:</span> <span>{item.referensi}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Scroll size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">Belum ada dokumen Bahtsu Masail</p>
        </div>
      )}

      {/* ── Modal Create/Edit ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {editingItem ? 'Edit Keputusan Bahtsu Masail' : 'Tambah Keputusan Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Mas&#39;alah *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Mis: Hukum Penggunaan Fintech dalam Muamalah..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Sidang *</label>
                <input
                  type="number"
                  required
                  min={2000}
                  max={2100}
                  value={formData.tahun}
                  onChange={e => setFormData({ ...formData, tahun: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tashawwurul Mas&#39;alah (Deskripsi Masalah) *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.tashawwur}
                  onChange={e => setFormData({ ...formData, tashawwur: e.target.value })}
                  placeholder="Deskripsi atau gambaran masalah yang dibahas dalam sidang bahtsu..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Keputusan / Hukum *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.hukum}
                  onChange={e => setFormData({ ...formData, hukum: e.target.value })}
                  placeholder="Keputusan musyawarah dan hukum yang ditetapkan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Dalil Al-Qur&#39;an / Hadis</label>
                  <input
                    type="text"
                    value={formData.dalil}
                    onChange={e => setFormData({ ...formData, dalil: e.target.value })}
                    placeholder="QS. Al-Baqarah: 275, HR. Bukhari"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Referensi Kitab</label>
                  <input
                    type="text"
                    value={formData.referensi}
                    onChange={e => setFormData({ ...formData, referensi: e.target.value })}
                    placeholder="Fathul Wahhab, I'anah al-Talibin"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL Dokumen PDF (Opsional)</label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={e => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://... (link Google Drive atau server)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <Check size={14} />
                  {saving ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Simpan Keputusan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
