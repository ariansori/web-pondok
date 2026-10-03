'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Pin, X } from 'lucide-react';
import { fetchMaklumat, createMaklumat, updateMaklumat, deleteMaklumat, MaklumatItem } from '@/lib/api';

const DEFAULT_FORM_DATA = {
  judul: '',
  konten: '',
  kategori: 'pengumuman' as 'pengumuman' | 'maklumat' | 'berita',
  penting: false,
};

export default function AdminMaklumatPage() {
  const [maklumatList, setMaklumatList] = useState<MaklumatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMaklumat();
      setMaklumatList(data || []);
    } catch (err) {
      console.error('Failed to load maklumat', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM_DATA);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MaklumatItem) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      konten: item.konten,
      kategori: item.kategori,
      penting: Boolean(item.penting),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus surat maklumat/pengumuman ini?')) return;
    try {
      await deleteMaklumat(id);
      setMaklumatList(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Gagal menghapus maklumat.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.konten) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateMaklumat(editingId, formData);
      } else {
        await createMaklumat(formData);
      }
      await loadData(); // Ambil ulang dari server agar tanggal 'published_at' sesuai DB
      setModalOpen(false);
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = maklumatList.filter(m =>
    m.judul.toLowerCase().includes(search.toLowerCase()) || m.konten.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Manajemen Maklumat & Pengumuman
          </h1>
          <p className="text-xs text-gray-500 mt-1">Terbitkan warta resmi pengasuh dan edaran santri.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Buat Maklumat Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul maklumat atau pengumuman..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase tracking-wider font-extrabold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Judul Maklumat</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Prioritas</th>
                <th className="px-6 py-4">Tanggal Diterbitkan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Memuat data maklumat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Tidak ada maklumat ditemukan.</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 max-w-sm">
                      <p className="line-clamp-1">{item.judul}</p>
                      <p className="text-[11px] font-normal text-gray-400 mt-0.5 line-clamp-1">{item.konten}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-green-50 text-green-800 rounded-full text-[11px] font-bold uppercase">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {Boolean(item.penting) ? (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold flex items-center gap-1 w-max">
                          <Pin size={11} className="rotate-45 text-amber-700" /> PENTING
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Biasa</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : 'Hari ini'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-700">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-700">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {editingId ? 'Edit Maklumat' : 'Terbitkan Maklumat Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Maklumat / Pengumuman *</label>
                <input type="text" required value={formData.judul} onChange={e => setFormData({ ...formData, judul: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 font-semibold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kategori Dokumen *</label>
                <select value={formData.kategori} onChange={e => setFormData({ ...formData, kategori: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                  <option value="pengumuman">Pengumuman Terbuka</option>
                  <option value="maklumat">Maklumat Resmi Pengasuh</option>
                  <option value="berita">Berita Santri / Pondok</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Isi Surat Maklumat *</label>
                <textarea rows={8} required value={formData.konten} onChange={e => setFormData({ ...formData, konten: e.target.value })} placeholder="Assalamu'alaikum Wr. Wb. Diberitahukan kepada..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 leading-relaxed font-sans" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="penting_toggle" checked={formData.penting} onChange={e => setFormData({ ...formData, penting: e.target.checked })} className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" />
                <label htmlFor="penting_toggle" className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <Pin size={13} className="text-amber-600" /> Sematkan sebagai Pengumuman PENTING (Pinned)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md disabled:opacity-50">
                  {isSubmitting ? 'Memproses...' : 'Terbitkan Maklumat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}