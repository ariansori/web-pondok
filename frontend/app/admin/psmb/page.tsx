'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Check,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Filter,
  MessageSquare,
  Eye,
  Trash2,
  School,
} from 'lucide-react';
import { fetchPSMBList, updatePSMBStatus, deletePSMB } from '@/lib/api';

interface PSMBItem {
  id: number;
  nama_santri: string;
  nama_wali?: string;
  no_hp_wali?: string;
  email_wali?: string;
  jenjang: string;
  kelas_asal?: string;
  asal_sekolah?: string;
  jenis_kelamin?: string;
  status: 'pending' | 'diterima' | 'ditolak';
  catatan?: string;
  created_at?: string;
}

const FALLBACK_PSMB: PSMBItem[] = [
  {
    id: 1,
    nama_santri: 'Muhammad Fauzan Al-Habib',
    nama_wali: 'Bapak Ahmad Habib',
    no_hp_wali: '08123456789',
    email_wali: 'ahmad.habib@email.com',
    jenjang: 'MTS',
    kelas_asal: '6 SD',
    asal_sekolah: 'SDN 1 Surabaya',
    jenis_kelamin: 'L',
    status: 'pending',
    created_at: '2026-09-15T09:30:00Z',
  },
  {
    id: 2,
    nama_santri: 'Zainab Fauziyah Al-Muthi\'ah',
    nama_wali: 'Ibu Siti Fatimah',
    no_hp_wali: '08234567890',
    email_wali: 'siti.fatimah@email.com',
    jenjang: 'MA',
    kelas_asal: '9 MTS',
    asal_sekolah: 'MTS Darul Ulum',
    jenis_kelamin: 'P',
    status: 'diterima',
    catatan: 'Sudah lulus tes tahfizh dengan nilai sangat baik',
    created_at: '2026-09-10T07:15:00Z',
  },
  {
    id: 3,
    nama_santri: 'Abdullah Mubarak Syarif',
    nama_wali: 'Bapak Mubarak Syarif',
    no_hp_wali: '08345678901',
    jenjang: 'MTS',
    kelas_asal: '6 SD',
    asal_sekolah: 'MI Al-Hidayah',
    jenis_kelamin: 'L',
    status: 'ditolak',
    catatan: 'Kuota kelas sudah penuh untuk jenjang MTS gelombang 1',
    created_at: '2026-09-08T14:00:00Z',
  },
];

const STATUS_CONFIG = {
  pending: { label: 'Menunggu Seleksi', color: 'bg-yellow-100 text-yellow-800', icon: Clock, dot: 'bg-yellow-500' },
  diterima: { label: 'Diterima', color: 'bg-green-100 text-green-800', icon: CheckCircle, dot: 'bg-green-500' },
  ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: AlertCircle, dot: 'bg-red-500' },
};

export default function AdminPSMBPage() {
  const [list, setList] = useState<PSMBItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'pending' | 'diterima' | 'ditolak'>('semua');
  const [jenjangFilter, setJenjangFilter] = useState('Semua');
  const [detailItem, setDetailItem] = useState<PSMBItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPSMBList()
      .then(data => {
        if (Array.isArray(data)) setList(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id: number, status: 'diterima' | 'ditolak') => {
    try { await updatePSMBStatus(id, status); } catch {}
    setList(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    if (detailItem?.id === id) setDetailItem(prev => prev ? { ...prev, status } : prev);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data pendaftaran ini?')) return;
    try { await deletePSMB(id); } catch {}
    setList(prev => prev.filter(p => p.id !== id));
    if (detailItem?.id === id) setDetailItem(null);
  };

  const filtered = list.filter(p => {
    const matchStatus = statusFilter === 'semua' || p.status === statusFilter;
    const matchJenjang = jenjangFilter === 'Semua' || p.jenjang === jenjangFilter;
    const santriName = (p.nama_santri || (p as any).nama_lengkap || '').toLowerCase();
    const waliName = (p.nama_wali || (p as any).nama_ayah || '').toLowerCase();
    const matchSearch =
      santriName.includes(search.toLowerCase()) ||
      waliName.includes(search.toLowerCase());
    return matchStatus && matchJenjang && matchSearch;
  });

  const jenjangOptions = ['Semua', ...Array.from(new Set(list.map(p => p.jenjang)))];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Pendaftaran PSMB — Seleksi Santri
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola data pendaftaran, verifikasi, dan keputusan seleksi penerimaan santri baru.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-xs font-bold">
          <GraduationCap size={16} />
          Total {list.length} Pendaftar
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Semua', value: list.length, color: 'bg-blue-50 border-blue-100', textColor: 'text-blue-800' },
          { label: 'Pending', value: list.filter(p => p.status === 'pending').length, color: 'bg-yellow-50 border-yellow-100', textColor: 'text-yellow-800' },
          { label: 'Diterima', value: list.filter(p => p.status === 'diterima').length, color: 'bg-green-50 border-green-100', textColor: 'text-green-800' },
          { label: 'Ditolak', value: list.filter(p => p.status === 'ditolak').length, color: 'bg-red-50 border-red-100', textColor: 'text-red-800' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 border ${s.color} text-center`}>
            <p className={`text-2xl font-black ${s.textColor}`}>{s.value}</p>
            <p className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${s.textColor}`}>{s.label}</p>
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
            placeholder="Cari nama santri atau wali santri..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['semua', 'pending', 'diterima', 'ditolak'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                statusFilter === s ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
          <div className="flex items-center gap-1 ml-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={jenjangFilter}
              onChange={e => setJenjangFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-green-600"
            >
              {jenjangOptions.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase tracking-wider font-extrabold border-b border-gray-100">
              <tr>
                <th className="px-5 py-4">Nama Santri</th>
                <th className="px-5 py-4">Wali</th>
                <th className="px-5 py-4">Jenjang</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Daftar</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => {
                const statusConf = STATUS_CONFIG[item.status];
                const StatusIcon = statusConf.icon;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          item.jenis_kelamin === 'P' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.jenis_kelamin || 'L'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.nama_santri}</p>
                          {item.asal_sekolah && <p className="text-[11px] text-gray-400">{item.asal_sekolah}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{item.nama_wali || '-'}</p>
                      {item.no_hp_wali && (
                        <a
                          href={`https://wa.me/${item.no_hp_wali?.replace(/\D/g, '').replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-green-700 hover:underline mt-0.5"
                        >
                          <MessageSquare size={11} />
                          {item.no_hp_wali}
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-green-50 text-green-800 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit">
                        <School size={10} /> {item.jenjang}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${statusConf.color}`}>
                        <StatusIcon size={10} />
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'diterima')}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                              title="Terima"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'ditolak')}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              title="Tolak"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <GraduationCap size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">Tidak ada data pendaftaran</p>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                Detail Pendaftar
              </h3>
              <button onClick={() => setDetailItem(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold ${STATUS_CONFIG[detailItem.status].color}`}>
                {(() => { const StatusIcon = STATUS_CONFIG[detailItem.status].icon; return <StatusIcon size={16} />; })()}
                {STATUS_CONFIG[detailItem.status].label}
              </div>

              {/* Info Grid */}
              {[
                { label: 'Nama Santri', value: detailItem.nama_santri, icon: User },
                { label: 'Jenjang Dituju', value: detailItem.jenjang, icon: School },
                { label: 'Kelas Asal', value: detailItem.kelas_asal, icon: GraduationCap },
                { label: 'Asal Sekolah', value: detailItem.asal_sekolah, icon: School },
                { label: 'Nama Wali', value: detailItem.nama_wali, icon: User },
                { label: 'No. HP Wali', value: detailItem.no_hp_wali, icon: Phone },
                { label: 'Email Wali', value: detailItem.email_wali, icon: Phone },
              ].map(field => field.value ? (
                <div key={field.label} className="flex items-start gap-3">
                  <field.icon size={15} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase">{field.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{field.value}</p>
                  </div>
                </div>
              ) : null)}

              {detailItem.catatan && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-3">
                  <p className="text-[11px] font-bold text-yellow-700 mb-1">Catatan Admin</p>
                  <p className="text-xs text-gray-700">{detailItem.catatan}</p>
                </div>
              )}

              {/* WhatsApp Button */}
              {detailItem.no_hp_wali && (
                <a
                  href={`https://wa.me/${detailItem.no_hp_wali.replace(/\D/g, '').replace(/^0/, '62')}?text=Assalamu'alaikum%20warahmatullahi%20wabarakatuh%2C%20kami%20dari%20PP%20Al-Fatich%20ingin%20menyampaikan%20informasi%20mengenai%20pendaftaran%20putra%2Fputri%20Bapak%2FIbu%20atas%20nama%20${encodeURIComponent(detailItem.nama_santri)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all"
                >
                  <MessageSquare size={16} />
                  Chat WhatsApp Wali Santri
                </a>
              )}

              {/* Quick Status Actions */}
              {detailItem.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { handleUpdateStatus(detailItem.id, 'diterima'); setDetailItem(null); }}
                    className="flex-1 py-2.5 rounded-2xl bg-green-700 text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Check size={14} /> Terima Pendaftar
                  </button>
                  <button
                    onClick={() => { handleUpdateStatus(detailItem.id, 'ditolak'); setDetailItem(null); }}
                    className="flex-1 py-2.5 rounded-2xl border border-red-200 text-red-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-50"
                  >
                    <X size={14} /> Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
