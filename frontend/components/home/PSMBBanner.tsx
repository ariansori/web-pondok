'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GraduationCap, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { PSMB_DEADLINE, WHATSAPP_ADMIN } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

const REQUIREMENTS = [
  'Beragama Islam',
  'Usia sesuai jenjang yang dipilih (RA s/d MA)',
  'Mengisi formulir pendaftaran online',
  'Menyerahkan fotokopi Akta Kelahiran & KK',
  'Pas foto terbaru 3×4 (4 lembar)',
  'Surat keterangan sehat dari dokter',
];

export function PSMBBanner() {
  const timeLeft = useCountdown(PSMB_DEADLINE);
  const waUrl = getWhatsAppUrl(WHATSAPP_ADMIN, 'Assalamu\'alaikum, saya ingin informasi pendaftaran PSMB PP Al-Fatich 2026/2027');

  return (
    <section id="psmb-cta" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0D5C2B 0%, #169645 60%, #1a7a4a 100%)' }} />
      <div className="absolute inset-0 hero-pattern opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 mb-6"
              style={{ background: 'rgba(244,180,26,0.12)' }}>
              <GraduationCap size={16} className="text-yellow-400" />
              <span className="text-yellow-300 text-sm font-bold">PSMB 2026/2027 Dibuka!</span>
            </div>

            <h2 className="text-white mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.2 }}>
              Penerimaan Santri<br />
              <span style={{ color: '#F4B41A' }}>Murid Baru</span>
            </h2>
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Daftarkan putra-putri Anda ke Pondok Pesantren Al-Fatich dan wujudkan generasi
              yang Qur'ani, berakhlaqul karimah, dan berwawasan luas.
            </p>

            {/* Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {REQUIREMENTS.map((req) => (
                <div key={req} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm">{req}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/psmb" id="cta-psmb-banner" className="btn-primary text-base">
                <GraduationCap size={18} />
                Daftar Sekarang
              </Link>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="btn-outline text-base">
                <Phone size={16} />
                Hubungi Admin
              </a>
            </div>
          </div>

          {/* Right: Countdown */}
          <div className="glass-card p-8 rounded-3xl text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={18} className="text-yellow-400" />
              <p className="text-white/70 text-sm font-medium">Batas Pendaftaran</p>
            </div>
            <p className="text-yellow-300 font-bold text-lg mb-6">31 Agustus 2026</p>

            {/* Countdown boxes */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { value: timeLeft.days, label: 'Hari' },
                { value: timeLeft.hours, label: 'Jam' },
                { value: timeLeft.minutes, label: 'Menit' },
                { value: timeLeft.seconds, label: 'Detik' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/10 rounded-2xl p-3 border border-white/20">
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-white/50 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Jenjang badges */}
            <p className="text-white/60 text-sm mb-4">Jenjang yang tersedia:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['RA', 'MI', 'MTs', 'MA', 'Madrasah Al-Qur\'an'].map(j => (
                <span key={j} className="px-3 py-1 rounded-full text-sm font-bold text-gray-900"
                  style={{ background: 'linear-gradient(135deg, #F4B41A, #D4970E)' }}>
                  {j}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
