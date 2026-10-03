'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Search,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Tag,
  CheckCircle2,
  X,
  Info
} from 'lucide-react';
import { fetchAgenda, AgendaItem } from '@/lib/api';
import { formatDateShort, formatDateLong } from '@/lib/utils';

const STATUS_FILTERS = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Akan Datang', value: 'upcoming' },
  { label: 'Sedang Berlangsung', value: 'ongoing' },
  { label: 'Selesai', value: 'done' },
];

const CATEGORIES = ['Semua Kategori', 'Keagamaan', 'Akademik', 'PSMB', 'Wisuda', 'Sosial', 'Umum'];

const STATUS_STYLES = {
  upcoming: { bg: '#EBF5EB', color: '#169645', label: 'Akan Datang' },
  ongoing: { bg: '#FFF8E1', color: '#D4970E', label: 'Sedang Berlangsung' },
  done: { bg: '#F5F5F5', color: '#777777', label: 'Selesai' },
};

export default function PublicAgendaPage() {
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAgenda({ limit: 50 })
      .then((data) => {
        if (Array.isArray(data)) setAgendas(data);
      })
      .catch((err) => console.error('Failed to load agendas:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = agendas.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchCategory = selectedCategory === 'Semua Kategori' || item.kategori === selectedCategory;
    const matchSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.lokasi && item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchCategory && matchSearch;
  });

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Banner Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/informasi" className="hover:text-white transition-colors">Informasi</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Agenda & Kegiatan</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays size={13} /> Jadwal Kegiatan Santri
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Agenda Pesantren Al-Fatich
          </h1>
          <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
            Ikuti kalender acara, pengajian akbar, khataman Al-Qur&apos;an, peringatan hari besar Islam, dan jadwal akademik pondok pesantren.
          </p>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filter & Search Bar ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama agenda atau lokasi acara..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>

            {/* Status Pills */}
            <div className="flex gap-2 flex-wrap w-full md:w-auto">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={
                    statusFilter === s.value
                      ? { background: '#0D5C2B', color: '#ffffff', boxShadow: '0 2px 8px rgba(13,92,43,0.25)' }
                      : { background: '#f3f4f6', color: '#374151' }
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap mr-1">Kategori:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-yellow-400 text-gray-950 font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Agendas List ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse flex gap-5">
                <div className="w-20 h-24 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 text-gray-500">
            <CalendarDays size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-base">Tidak ada agenda yang sesuai dengan filter.</p>
            <p className="text-sm text-gray-400 mt-1">Coba gunakan kata kunci lain atau ubah pilihan filter Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => {
              const dateInfo = formatDateShort(item.tanggal_mulai);
              const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.upcoming;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex cursor-pointer"
                >
                  {/* Date Badge Banner */}
                  <div
                    className="flex-shrink-0 w-24 sm:w-28 flex flex-col items-center justify-center p-4 text-white text-center transition-colors"
                    style={{ background: 'linear-gradient(180deg, #169645, #0D5C2B)' }}
                  >
                    <span className="text-3xl sm:text-4xl font-black leading-none">{dateInfo.day}</span>
                    <span className="text-xs sm:text-sm font-bold text-green-200 uppercase mt-1 tracking-wider">
                      {dateInfo.month}
                    </span>
                    <span className="text-[10px] text-white/60 mt-1">
                      {item.tanggal_mulai ? new Date(item.tanggal_mulai).getFullYear() : ''}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background: statusStyle.bg, color: statusStyle.color }}
                        >
                          {statusStyle.label}
                        </span>
                        {item.kategori && (
                          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                            {item.kategori}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-green-700 transition-colors mb-2 leading-snug">
                        {item.judul}
                      </h3>

                      {item.deskripsi && (
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                          {item.deskripsi}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      {item.lokasi ? (
                        <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                          <MapPin size={14} className="text-green-600 flex-shrink-0" />
                          <span className="truncate">{item.lokasi}</span>
                        </span>
                      ) : <span />}

                      <span className="text-green-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Detail <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: STATUS_STYLES[selectedItem.status]?.bg || '#EBF5EB',
                  color: STATUS_STYLES[selectedItem.status]?.color || '#169645',
                }}
              >
                {STATUS_STYLES[selectedItem.status]?.label || selectedItem.status}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                {selectedItem.kategori}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              {selectedItem.judul}
            </h3>

            <div className="space-y-3 bg-gray-50 rounded-2xl p-4 mb-5 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-green-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Tanggal Pelaksanaan</p>
                  <p className="text-gray-600">
                    {formatDateLong(selectedItem.tanggal_mulai)}
                    {selectedItem.tanggal_selesai && ` s/d ${formatDateLong(selectedItem.tanggal_selesai)}`}
                  </p>
                </div>
              </div>

              {selectedItem.lokasi && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-green-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Lokasi Acara</p>
                    <p className="text-gray-600">{selectedItem.lokasi}</p>
                  </div>
                </div>
              )}
            </div>

            {selectedItem.deskripsi && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Keterangan Kegiatan</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedItem.deskripsi}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-sm transition-colors shadow-md"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}