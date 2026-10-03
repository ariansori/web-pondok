'use client';

import Link from 'next/link';
import { 
  MessageSquareQuote, 
  Scroll, 
  ChevronRight, 
  ArrowRight, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Sparkles
} from 'lucide-react';

const FORUM_CHANNELS = [
  {
    title: 'Tanya Jawab Syariah',
    desc: 'Ruang interaktif konsultasi fiqih, ibadah sehari-hari, muamalah kontemporer, dan tata tertib santri yang dijawab oleh Dewan Asatidz.',
    href: '/forum/tanya-jawab',
    icon: MessageSquareQuote,
    color: '#169645',
    tag: 'Konsultasi & Fatwa',
  },
  {
    title: 'Bahtsu Masail',
    desc: 'Dokumentasi hasil musyawarah dan telaah mendalam persoalan hukum Islam berdasarkan rujukan kitab kuning (turats) mu\'tabarah.',
    href: '/forum/bahtsu-masail',
    icon: Scroll,
    color: '#0D5C2B',
    tag: 'Hasil Musyawarah',
  },
];

export default function ForumHubPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Forum Keislaman</span>
          </nav>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users size={13} />
              Wadah Musyawarah & Konsultasi
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Forum & Konsultasi Fiqih
          </h1>
          <p className="text-white/80 max-w-2xl text-base sm:text-lg">
            Media interaktif bagi santri, wali santri, dan masyarakat luas untuk memperdalam pemahaman hukum Islam dan menelaah hasil musyawarah bahtsul masail.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FORUM_CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <Link
                key={ch.href}
                href={ch.href}
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ background: ch.color }}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${ch.color}, #0D5C2B)` }}
                    >
                      <Icon size={26} />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 group-hover:bg-green-100 group-hover:text-green-800 transition-colors">
                      {ch.tag}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {ch.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {ch.desc}
                  </p>
                </div>

                <div className="flex items-center text-sm font-bold text-green-700 group-hover:text-green-800 transition-colors gap-1 pt-4 border-t border-gray-100">
                  <span>Masuk ke {ch.title}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
