'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { fetchArtikel, createArtikel, updateArtikel, deleteArtikel, ArtikelItem } from '@/lib/api';

export default function AdminArtikelPage() {
  const [artikelList, setArtikelList] = useState<ArtikelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Modal Create/Edit State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArtikelItem | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    ringkasan: '',
    penulis: 'Dewan Asatidz PP Al-Fatich',
    kategori: 'Pendidikan',
    tags: 'Al-Fatich, Salafi, Kajian',
    published: true,
  });

  const loadData = () => {
    setLoading(true);
    fetchArtikel({ published: 'all', limit: 100 })
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setArtikelList(res.data);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      konten: '',
      ringkasan: '',
      penulis: 'Dewan Asatidz PP Al-Fatich',
      kategori: 'Pendidikan',
      tags: 'Al-Fatich, Salafi, Kajian',
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ArtikelItem) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      konten: item.konten,
      ringkasan: item.ringkasan,
      penulis: item.penulis,
      kategori: item.kategori,
      tags: item.tags || '',
      published: Boolean(item.published),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      await deleteArtikel(id);
    } catch { }
    setArtikelList(prev => prev.filter(a => a.id !== id));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.konten) return;

    if (editingItem) {
      try {
        await updateArtikel(editingItem.id, formData);
        await loadData(); // Refresh dari server
      } catch { }
    } else {
      try {
        await createArtikel(formData);
        await loadData(); // Refresh dari server
      } catch { }
    }

    setModalOpen(false);
  };

  const filtered = artikelList.filter(a => {
    const matchCat = categoryFilter === 'Semua' || a.kategori === categoryFilter;
    const matchSearch = a.judul.toLowerCase().includes(search.toLowerCase()) || a.penulis.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Manajemen Artikel & Wawasan
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola publikasi tulisan kajian fiqih, tadabbur Al-Qur&apos;an, dan kabar pesantren.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Tulis Artikel Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul artikel atau nama penulis..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {['Semua', 'Pendidikan', 'Keislaman', 'Fiqih', 'Santri'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${categoryFilter === cat
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Articles */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase tracking-wider font-extrabold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Judul Artikel</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Penulis</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">Memuat data artikel...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">Belum ada artikel. Klik &ldquo;Tulis Artikel Baru&rdquo; untuk memulai.</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 max-w-sm">
                    <p className="line-clamp-1">{item.judul}</p>
                    <p className="text-[11px] font-normal text-gray-400 mt-0.5 line-clamp-1">{item.ringkasan}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-50 text-green-800 rounded-full text-[11px] font-bold">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{item.penulis}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${item.published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/artikel/${item.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-700 transition-colors inline-block"
                      title="Lihat Pratinjau Publik"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-700 transition-colors"
                      title="Edit Artikel"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      title="Hapus Artikel"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Create / Edit Artikel ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {editingItem ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Masukkan judul artikel yang menarik..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={formData.kategori}
                    onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-600"
                  >
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Keislaman">Keislaman</option>
                    <option value="Fiqih">Fiqih</option>
                    <option value="Santri">Santri</option>
                    <option value="Berita">Berita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Penulis *</label>
                  <input
                    type="text"
                    required
                    value={formData.penulis}
                    onChange={e => setFormData({ ...formData, penulis: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ringkasan / Sinopsis Singkat</label>
                <textarea
                  rows={2}
                  value={formData.ringkasan}
                  onChange={e => setFormData({ ...formData, ringkasan: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk preview..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Konten Lengkap Artikel *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.konten}
                  onChange={e => setFormData({ ...formData, konten: e.target.value })}
                  placeholder="Tuliskan isi artikel lengkap di sini. Gunakan baris baru untuk paragraf..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tags (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Kitab Kuning, Talaqqi, Fiqih"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published_toggle"
                  checked={formData.published}
                  onChange={e => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="published_toggle" className="text-xs font-bold text-gray-800">
                  Langsung Publikasikan ke Website (Live)
                </label>
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
                  {editingItem ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
