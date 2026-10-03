'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Star, School, Layers, Award, ChevronRight } from 'lucide-react';
import { fetchLembaga, LembagaItem } from '@/lib/api';

const DEFAULT_LEMBAGA = [
  {
    id: 'mq',
    nama: 'Madrasah Al-Qur\'an',
    singkatan: 'MAQ',
    kategori: 'Dloruriyat',
    desc: 'Program unggulan hafalan Al-Qur\'an 30 Juz dengan metode talaqqi bersanad.',
    color: '#169645',
    bg: '#F0FFF4',
    href: '/lembaga',
  },
  {
    id: 'md',
    nama: 'Madrasah Diniyah',
    singkatan: 'MD',
    kategori: 'Dloruriyat',
    desc: 'Program kajian kitab kuning secara sistematis dan mendalam untuk memahami ilmu agama.',
    color: '#0D5C2B',
    bg: '#E8F5E9',
    href: '/lembaga',
  },
  {
    id: 'ra',
    nama: 'Raudhatul Athfal',
    singkatan: 'RA',
    kategori: 'Hajiyat',
    desc: 'Pendidikan anak usia dini Islami yang menyenangkan dan stimulatif.',
    color: '#F4B41A',
    bg: '#FFFBEB',
    href: '/lembaga',
  },
  {
    id: 'mi',
    nama: 'Madrasah Ibtidaiyah',
    singkatan: 'MI',
    kategori: 'Hajiyat',
    desc: 'Setingkat SD dengan kurikulum terpadu agama dan ilmu pengetahuan.',
    color: '#169645',
    bg: '#F0FFF4',
    href: '/lembaga',
  },
  {
    id: 'mts',
    nama: 'Madrasah Tsanawiyah',
    singkatan: 'MTs',
    kategori: 'Hajiyat',
    desc: 'Setingkat SMP dengan pendalaman kitab kuning dan ilmu modern.',
    color: '#0D5C2B',
    bg: '#E8F5E9',
    href: '/lembaga',
  },
  {
    id: 'ma',
    nama: 'Madrasah Aliyah',
    singkatan: 'MA',
    kategori: 'Hajiyat',
    desc: 'Setingkat SMA dengan persiapan menuju perguruan tinggi berkualitas.',
    color: '#F4B41A',
    bg: '#FFFBEB',
    href: '/lembaga',
  },
];

const ICONS = [BookOpen, BookOpen, Star, School, Layers, Award];

export function LembagaCards() {
  const [lembagaList, setLembagaList] = useState(DEFAULT_LEMBAGA);

  useEffect(() => {
    fetchLembaga()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: LembagaItem, i: number) => ({
            id: String(item.id),
            nama: item.nama,
            singkatan: item.singkatan || item.nama.split(' ').map(w => w[0]).join(''),
            kategori: item.kategori === 'dloruriyat' ? 'Dloruriyat' : 'Hajiyat',
            desc: item.deskripsi || DEFAULT_LEMBAGA[i % DEFAULT_LEMBAGA.length].desc,
            color: DEFAULT_LEMBAGA[i % DEFAULT_LEMBAGA.length].color,
            bg: DEFAULT_LEMBAGA[i % DEFAULT_LEMBAGA.length].bg,
            href: '/lembaga',
          }));
          setLembagaList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="lembaga-preview" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="badge-gold mb-4 inline-block">Unit Pendidikan</span>
          <h2 className="section-title mb-4">Lembaga Pendidikan Al-Fatich</h2>
          <div className="divider-green mx-auto mb-4" />
          <p className="section-subtitle mx-auto text-center">
            Dua program utama — <strong>Dloruriyat</strong> (kebutuhan primer keislaman) dan{' '}
            <strong>Hajiyat</strong> (pendidikan formal) — dirancang untuk mencetak generasi yang
            unggul dalam ilmu agama sekaligus siap menghadapi tantangan zaman.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {lembagaList.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-hover overflow-hidden transition-all duration-300"
              >
                {/* Top gradient stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${item.color}, #F4B41A)` }}
                />

                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ background: item.bg }}
                  >
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.kategori}
                  </span>
                </div>

                {/* Singkatan */}
                <div className="text-2xl font-extrabold mb-1" style={{ color: item.color }}>
                  {item.singkatan}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{item.nama}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-3"
                  style={{ color: item.color }}
                >
                  Detail Lembaga <ChevronRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
