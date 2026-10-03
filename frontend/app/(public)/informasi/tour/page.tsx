'use client';

import { useState } from 'react';
import { ChevronRight, MapPin, Info, X } from 'lucide-react';
import Link from 'next/link';
import { CAMPUS_HOTSPOTS } from '@/lib/constants';

type Hotspot = typeof CAMPUS_HOTSPOTS[0];

export default function TourPage() {
  const [selected, setSelected] = useState<Hotspot | null>(null);

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} /><Link href="/informasi" className="hover:text-white">Informasi</Link>
            <ChevronRight size={14} /><span className="text-white font-medium">Tour Pesantren</span>
          </nav>
          <h1 className="text-white text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Tour Virtual Pesantren</h1>
          <p className="text-white/70">Jelajahi berbagai sudut Pondok Pesantren Al-Fatich secara interaktif.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} style={{ color: '#169645' }} />
                <h2 className="font-bold text-gray-900">Peta Kompleks PP Al-Fatich</h2>
                <span className="text-xs text-gray-400 ml-auto">Klik titik untuk detail</span>
              </div>

              {/* Map Container */}
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  height: '420px',
                  background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 30%, #81c784 60%, #66bb6a 100%)',
                }}
              >
                {/* Map decorations */}
                {/* Road */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-400/40" style={{ borderRadius: '0' }} />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-2 h-full bg-gray-300/30" />

                {/* Building blocks */}
                <div className="absolute" style={{ top: '25%', left: '42%', width: '15%', height: '12%', background: '#fff', borderRadius: '4px', border: '2px solid #169645', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🕌</div>
                <div className="absolute" style={{ top: '50%', left: '20%', width: '12%', height: '10%', background: '#fff', borderRadius: '4px', border: '2px solid #0D5C2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏠</div>
                <div className="absolute" style={{ top: '50%', left: '66%', width: '12%', height: '10%', background: '#fff', borderRadius: '4px', border: '2px solid #0D5C2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏠</div>
                <div className="absolute" style={{ top: '40%', left: '52%', width: '14%', height: '10%', background: '#fff', borderRadius: '4px', border: '2px solid #169645', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏫</div>
                <div className="absolute" style={{ top: '65%', left: '37%', width: '11%', height: '9%', background: '#fff', borderRadius: '4px', border: '2px solid #F4B41A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🍽️</div>
                <div className="absolute" style={{ top: '20%', left: '57%', width: '12%', height: '10%', background: '#fff', borderRadius: '4px', border: '2px solid #169645', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏛️</div>
                <div className="absolute" style={{ top: '35%', left: '27%', width: '13%', height: '10%', background: '#fff', borderRadius: '4px', border: '2px solid #F4B41A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📖</div>

                {/* Label overlays */}
                <div className="absolute bottom-11 left-0 right-0 text-center">
                  <span className="bg-gray-600/60 text-white text-xs px-3 py-1 rounded-full font-medium">Jl. Tambak Osowilangun</span>
                </div>

                {/* Hotspots */}
                {CAMPUS_HOTSPOTS.map(spot => (
                  <button
                    key={spot.id}
                    onClick={() => setSelected(spot)}
                    className="map-hotspot absolute z-10 hover:scale-125"
                    style={{ top: spot.top, left: spot.left, transform: 'translate(-50%, -50%)' }}
                    aria-label={spot.label}
                    title={spot.label}
                  >
                    <span className="text-xs font-bold text-gray-900">+</span>
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4">
                {CAMPUS_HOTSPOTS.map(s => (
                  <button key={s.id} onClick={() => setSelected(s)}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-green-700 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{selected.icon}</div>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X size={18} />
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">{selected.label}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{selected.desc}</p>
                <div className="p-3 rounded-xl text-sm" style={{ background: '#F0FFF4', color: '#169645' }}>
                  <Info size={14} className="inline mr-1" />
                  Klik hotspot lain di peta untuk menjelajahi lebih lanjut.
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24 text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="font-bold text-gray-900 mb-2">Jelajahi Pesantren</h3>
                <p className="text-gray-500 text-sm">Klik salah satu titik kuning pada peta untuk melihat informasi fasilitas.</p>
                <div className="mt-6 space-y-2">
                  {CAMPUS_HOTSPOTS.map(s => (
                    <button key={s.id} onClick={() => setSelected(s)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-green-50 transition-colors border border-gray-100">
                      <span className="text-xl">{s.icon}</span>
                      <span className="font-semibold text-sm text-gray-800">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
