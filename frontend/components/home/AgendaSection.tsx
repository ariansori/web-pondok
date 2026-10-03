'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight, Pin } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';
import { fetchAgenda, fetchMaklumat, AgendaItem, MaklumatItem } from '@/lib/api';

const STATUS_STYLES = {
  upcoming: { bg: '#EBF5EB', color: '#169645', label: 'Upcoming' },
  ongoing: { bg: '#FFF8E1', color: '#D4970E', label: 'Berlangsung' },
  done: { bg: '#F5F5F5', color: '#777', label: 'Selesai' },
};

export function AgendaMaklumatSection() {
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [maklumats, setMaklumats] = useState<MaklumatItem[]>([]);

  const [loadingAgenda, setLoadingAgenda] = useState(true);
  const [loadingMaklumat, setLoadingMaklumat] = useState(true);

  useEffect(() => {
    // Fetch 3 Agenda Terdekat
    fetchAgenda({ limit: 3, status: 'upcoming' })
      .then(data => {
        if (data) setAgendas(data);
      })
      .catch(err => console.error("Gagal load agenda:", err))
      .finally(() => setLoadingAgenda(false));

    // Fetch 3 Maklumat Terbaru
    fetchMaklumat({ limit: 3 })
      .then(data => {
        if (data) setMaklumats(data);
      })
      .catch(err => console.error("Gagal load maklumat:", err))
      .finally(() => setLoadingMaklumat(false));
  }, []);

  const formatTanggal = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section id="informasi-pesantren" className="py-16 md:py-20" style={{ background: 'var(--color-off-white)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">

          {/* ========================================= */}
          {/* KOLOM KIRI: AGENDA PESANTREN              */}
          {/* ========================================= */}
          <div className="flex flex-col">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="badge-green mb-2 inline-block">Kegiatan</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Agenda Pesantren
                </h2>
              </div>
              <Link href="/informasi/agenda" className="text-green-700 font-semibold text-sm md:text-base flex items-center gap-1 hover:gap-2 transition-all">
                Lihat Semua <ChevronRight size={18} />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {loadingAgenda ? (
                // UX: Skeleton Loading Agenda
                [...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex bg-white rounded-2xl border border-gray-100 h-28 overflow-hidden">
                    <div className="w-20 md:w-24 bg-gray-200"></div>
                    <div className="flex-1 p-4 md:p-5 space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : agendas.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                  Belum ada agenda terdekat.
                </div>
              ) : (
                agendas.map((item) => {
                  const dateInfo = formatDateShort(item.tanggal_mulai);
                  const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.upcoming;

                  return (
                    <div key={item.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex">
                      <div className="flex-shrink-0 w-20 md:w-24 flex flex-col items-center justify-center p-4 text-white transition-colors" style={{ background: 'linear-gradient(180deg, #169645, #0D5C2B)' }}>
                        <span className="text-3xl md:text-4xl font-extrabold leading-none">{dateInfo.day}</span>
                        <span className="text-xs md:text-sm font-medium text-green-200 uppercase mt-1">{dateInfo.month}</span>
                      </div>
                      <div className="flex-1 p-4 md:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                            {statusStyle.label}
                          </span>
                          <span className="text-[10px] md:text-xs text-gray-400">{item.kategori}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug mb-2 group-hover:text-green-700 transition-colors">
                          {item.judul}
                        </h3>
                        {item.lokasi && (
                          <div className="flex items-center gap-1.5 text-gray-500 text-sm md:text-base">
                            <MapPin size={16} className="flex-shrink-0" />
                            <span className="truncate">{item.lokasi}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ========================================= */}
          {/* KOLOM KANAN: MAKLUMAT & PENGUMUMAN        */}
          {/* ========================================= */}
          <div className="flex flex-col">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase mb-2">
                  Warta Resmi
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Maklumat Terbaru
                </h2>
              </div>
              <Link href="/informasi/maklumat" className="text-green-700 font-semibold text-sm md:text-base flex items-center gap-1 hover:gap-2 transition-all">
                Lihat Semua <ChevronRight size={18} />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {loadingMaklumat ? (
                // UX: Skeleton Loading Maklumat
                [...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse block bg-white rounded-2xl p-4 md:p-5 border border-gray-100 space-y-3">
                    <div className="flex gap-2 mb-2">
                      <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))
              ) : maklumats.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                  Belum ada maklumat terbaru.
                </div>
              ) : (
                maklumats.map((item) => {
                  const isPenting = Boolean(item.penting);

                  return (
                    <div key={item.id} className={`block bg-white rounded-2xl p-4 md:p-5 border transition-all duration-300 hover:shadow-lg ${isPenting ? 'border-amber-300 shadow-amber-500/5 bg-gradient-to-r from-amber-50/30 to-white' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {isPenting && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] md:text-xs font-extrabold flex items-center gap-1">
                            <Pin size={10} className="rotate-45" /> PENTING
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] md:text-xs font-bold uppercase">
                          {item.kategori}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatTanggal(item.published_at || item.created_at)}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-sm md:text-base hover:text-green-700 transition-colors mb-2">
                        {item.judul}
                      </h3>

                      <p className="text-gray-600 text-sm md:text-base line-clamp-1 leading-relaxed">
                        {item.konten}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}