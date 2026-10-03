'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { fetchAgenda, createAgenda, updateAgenda, deleteAgenda } from '@/lib/api';

export default function AdminAgendaPage() {
  const [agendaList, setAgendaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    lokasi: '',
    kategori: 'Keagamaan',
    status: 'upcoming',
  });

  useEffect(() => {
    fetchAgenda()
      .then((data) => {
        if (Array.isArray(data)) setAgendaList(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      deskripsi: '',
      tanggal_mulai: new Date().toISOString().slice(0, 10),
      tanggal_selesai: '',
      lokasi: 'PP Salafi Al-Fatich Surabaya',
      kategori: 'Keagamaan',
      status: 'upcoming',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.slice(0, 10) : '',
      tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.slice(0, 10) : '',
      lokasi: item.lokasi || '',
      kategori: item.kategori || 'Keagamaan',
      status: item.status || 'upcoming',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kegiatan/agenda ini?')) return;
    try {
      await deleteAgenda(id);
    } catch {}
    setAgendaList(prev => prev.filter(a => a.id !== id));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.tanggal_mulai) return;

    if (editingItem) {
      try {
        await updateAgenda(editingItem.id, formData);
      } catch {}
      setAgendaList(prev => prev.map(a => a.id === editingItem.id ? { ...a, ...formData } : a));
    } else {
      const newItem = { id: Date.now(), ...formData };
      try {
        await createAgenda(formData);
      } catch {}
      setAgendaList(prev => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  const filtered = agendaList.filter(a => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchSearch = a.judul.toLowerCase().includes(search.toLowerCase()) || (a.lokasi && a.lokasi.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Manajemen Agenda & Acara
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Atur jadwal kalender pesantren, wisuda, pengajian akbar, dan ujian santri.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Tambah Agenda Baru
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
            placeholder="Cari judul kegiatan atau lokasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Semua', value: 'all' },
            { label: 'Sedang Berjalan', value: 'ongoing' },
            { label: 'Akan Datang', value: 'upcoming' },
            { label: 'Selesai', value: 'done' },
          ].map(st => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st.value
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase tracking-wider font-extrabold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Nama Kegiatan</th>
                <th className="px-6 py-4">Waktu Pelaksanaan</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">Memuat data agenda...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">Belum ada agenda. Klik &ldquo;Tambah Agenda Baru&rdquo; untuk memulai.</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 max-w-xs">
                    {item.judul}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {item.tanggal_mulai ? item.tanggal_mulai.slice(0, 10) : ''}
                    {item.tanggal_selesai && ` s/d ${item.tanggal_selesai.slice(0, 10)}`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.lokasi || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-50 text-green-800 rounded-full text-[11px] font-bold">
                      {item.kategori || 'Umum'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.status === 'ongoing'
                        ? 'bg-amber-100 text-amber-900'
                        : item.status === 'done'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-700"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-700"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {editingItem ? 'Edit Agenda' : 'Tambah Agenda Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Agenda *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal_mulai}
                    onChange={e => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={e => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="PSMB">PSMB</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="upcoming">Akan Datang</option>
                    <option value="ongoing">Sedang Berjalan</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={e => setFormData({ ...formData, lokasi: e.target.value })}
                  placeholder="Masjid Jami' Al-Fatich"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Keterangan / Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
