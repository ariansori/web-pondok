'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchFilosofi } from '@/lib/api';

const DEFAULT_FILOSOFI = [
  { simbol: 'Ka\'bah', makna: 'Simbol kiblat umat Islam dan pusat peribadatan, melambangkan orientasi pesantren yang selalu berpedoman pada ajaran Islam yang bersumber dari Makkah Al-Mukarramah.', icon: '🕋', color: '#169645' },
  { simbol: 'Kitab Suci Al-Qur\'an', makna: 'Melambangkan bahwa PP Al-Fatich menjadikan Al-Qur\'an sebagai sumber utama ilmu, pedoman hidup, dan pilar utama seluruh kegiatan pendidikan.', icon: '📖', color: '#F4B41A' },
  { simbol: 'Pena', makna: 'Simbol keilmuan, kepenulisan, dan tradisi intelektual Islam. Melambangkan semangat para santri dalam menimba dan menyebarkan ilmu pengetahuan.', icon: '✒️', color: '#169645' },
  { simbol: 'Menara Masjid', makna: 'Melambangkan keagungan Islam, seruan dakwah (adzan), dan tekad pesantren dalam menjaga syi\'ar agama Islam di tengah masyarakat.', icon: '🕌', color: '#0D5C2B' },
  { simbol: 'Bola Dunia', makna: 'Melambangkan wawasan global santri Al-Fatich yang tidak hanya menguasai ilmu agama, namun juga siap menghadapi tantangan dunia modern.', icon: '🌍', color: '#F4B41A' },
];

export default function FilosofiPage() {
  const [filosofiList, setFilosofiList] = useState(DEFAULT_FILOSOFI);

  useEffect(() => {
    fetchFilosofi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any, i: number) => ({
            simbol: item.simbol,
            makna: item.makna,
            icon: item.icon || DEFAULT_FILOSOFI[i % DEFAULT_FILOSOFI.length].icon,
            color: DEFAULT_FILOSOFI[i % DEFAULT_FILOSOFI.length].color,
          }));
          setFilosofiList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/profil" className="hover:text-white">Profil</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Filosofi Lambang</span>
          </nav>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
            Filosofi Lambang PP Al-Fatich
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Setiap elemen dalam lambang pesantren mengandung makna mendalam yang merepresentasikan nilai-nilai Islam dan visi perjuangan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Logo display */}
        <div className="flex justify-center mb-14">
          <div
            className="w-44 h-44 sm:w-48 sm:h-48 rounded-full flex items-center justify-center text-7xl shadow-2xl border-4 border-yellow-400/30"
            style={{ background: 'linear-gradient(135deg, #169645, #0D5C2B)' }}
          >
            🕌
          </div>
        </div>

        {/* Filosofi Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filosofiList.map((item, i) => (
            <div
              key={item.simbol + i}
              className={`group bg-white rounded-2xl p-6 shadow-md border border-gray-100 card-hover transition-all duration-300 ${
                i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform"
                style={{ background: `${item.color}15` }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: item.color }}>
                {item.simbol}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.makna}</p>
            </div>
          ))}
        </div>

        {/* Warna Lambang */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Makna Warna Lambang
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: '#169645' }} />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Hijau Zamrud</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Melambangkan Islam, kesejukan, kesuburan, dan harapan. Warna yang identik dengan kedamaian dan ketakwaan dalam tradisi Islam.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: '#F4B41A' }} />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Kuning Keemasan</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Melambangkan kemuliaan, keagungan, cahaya ilmu pengetahuan, dan cita-cita yang luhur bagi setiap santri Al-Fatich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
