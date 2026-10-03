'use client';

import { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  X,
  Eye,
  Video,
  Film,
  AlertCircle,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { fetchGaleri, createGaleri, deleteGaleri } from '@/lib/api';

interface GaleriItem {
  id: number;
  judul: string;
  deskripsi?: string;
  url?: string;
  thumbnail?: string;
  kategori: string;
  tipe?: string;
  created_at?: string;
}

const FALLBACK_GALERI: GaleriItem[] = [
  {
    id: 1,
    judul: 'Kegiatan Maulid Nabi 1446 H',
    deskripsi: 'Peringatan Maulid Nabi Muhammad SAW di PP Al-Fatich',
    url: 'https://www.youtube.com/watch?v=example',
    thumbnail: 'https://images.unsplash.com/photo-1564510714747-69c3bc1fab41?w=400',
    kategori: 'Kegiatan',
    tipe: 'video',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 2,
    judul: 'Wisuda Santri Tahfizh 2026',
    deskripsi: 'Prosesi wisuda santri tahfizh Al-Qur\'an angkatan ke-12',
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    kategori: 'Wisuda',
    tipe: 'foto',
    created_at: '2026-08-15T09:00:00Z',
  },
  {
    id: 3,
    judul: 'Gedung Ma\'had Baru',
    deskripsi: 'Peresmian gedung asrama putri yang baru dibangun',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',
    kategori: 'Fasilitas',
    tipe: 'foto',
    created_at: '2026-07-20T10:30:00Z',
  },
];

const KATEGORI = ['Semua', 'Kegiatan', 'Wisuda', 'Fasilitas', 'Kajian', 'PSMB', 'Lainnya'];
const TIPE = ['foto', 'video'];

export default function AdminGaleriPage() {
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([]);
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<GaleriItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    url: '',
    thumbnail: '',
    kategori: 'Kegiatan',
    tipe: 'foto',
  });

  useEffect(() => {
    fetchGaleri()
      .then((data) => {
        if (Array.isArray(data)) setGaleriList(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus item galeri ini?')) return;
    try { await deleteGaleri(id); } catch {}
    setGaleriList(prev => prev.filter(g => g.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.url) return;

    const newItem: GaleriItem = {
      id: Date.now(),
      ...formData,
      created_at: new Date().toISOString(),
    };

    try { await createGaleri(formData); } catch {}
    setGaleriList(prev => [newItem, ...prev]);
    setModalOpen(false);
    setFormData({ judul: '', deskripsi: '', url: '', thumbnail: '', kategori: 'Kegiatan', tipe: 'foto' });
  };

  const filtered = galeriList.filter(g => {
    const matchKat = kategoriFilter === 'Semua' || g.kategori === kategoriFilter;
    const matchSearch = g.judul.toLowerCase().includes(search.toLowerCase());
    return matchKat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Galeri Kegiatan & Dokumentasi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola dokumentasi foto dan video kegiatan Pondok Pesantren Al-Fatich.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Tambah Dokumentasi
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul galeri..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {KATEGORI.map(k => (
            <button
              key={k}
              onClick={() => setKategoriFilter(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                kategoriFilter === k
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Item', value: galeriList.length, icon: ImageIcon, color: 'green' },
          { label: 'Foto', value: galeriList.filter(g => g.tipe !== 'video').length, icon: ImageIcon, color: 'blue' },
          { label: 'Video', value: galeriList.filter(g => g.tipe === 'video').length, icon: Film, color: 'purple' },
          { label: 'Kategori Aktif', value: [...new Set(galeriList.map(g => g.kategori))].length, icon: Tag, color: 'amber' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                <Icon size={18} className={`text-${stat.color}-700`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={48} />
                </div>
              )}
              {/* Tipe Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                item.tipe === 'video'
                  ? 'bg-purple-600 text-white'
                  : 'bg-green-600 text-white'
              }`}>
                {item.tipe === 'video' ? <Video size={10} /> : <ImageIcon size={10} />}
                {item.tipe === 'video' ? 'VIDEO' : 'FOTO'}
              </div>
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="p-2.5 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg"
                  title="Preview"
                >
                  <Eye size={16} />
                </button>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg"
                    title="Buka URL"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                {item.kategori}
              </span>
              <h3 className="font-bold text-gray-900 text-sm mt-2 line-clamp-1">{item.judul}</h3>
              {item.deskripsi && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.deskripsi}</p>
              )}
              {item.created_at && (
                <p className="text-[11px] text-gray-400 mt-2">
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">Belum ada item galeri</p>
          <p className="text-xs mt-1">Klik tombol &ldquo;Tambah Dokumentasi&rdquo; untuk mengunggah konten baru.</p>
        </div>
      )}

      {/* ── Modal Add Galeri ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Tambah Dokumentasi Baru
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Dokumentasi *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Mis: Wisuda Santri Tahfizh 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-600"
                  >
                    {KATEGORI.filter(k => k !== 'Semua').map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tipe Media</label>
                  <select
                    value={formData.tipe}
                    onChange={e => setFormData({ ...formData, tipe: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-600"
                  >
                    {TIPE.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL Foto/Video *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://... (URL gambar atau YouTube)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL Thumbnail (Opsional)</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://... (URL gambar thumbnail preview)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail}
                    alt="preview"
                    className="mt-2 h-24 w-full object-cover rounded-xl border border-gray-100"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Keterangan singkat tentang dokumentasi ini..."
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
                  className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all"
                >
                  Simpan ke Galeri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewItem(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>
            {previewItem.tipe === 'video' ? (
              <div className="aspect-video bg-black rounded-2xl flex items-center justify-center text-white/50">
                <Video size={64} />
                <p className="ml-3 text-sm">Buka URL untuk menonton video</p>
              </div>
            ) : (
              <img
                src={previewItem.url || previewItem.thumbnail}
                alt={previewItem.judul}
                className="w-full rounded-2xl max-h-[75vh] object-contain shadow-2xl"
              />
            )}
            <div className="mt-3 text-center text-white">
              <p className="font-bold">{previewItem.judul}</p>
              {previewItem.deskripsi && <p className="text-sm text-white/70 mt-1">{previewItem.deskripsi}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
