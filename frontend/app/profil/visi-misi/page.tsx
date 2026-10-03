import type { Metadata } from 'next';
import { ChevronRight, Target, Eye } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Visi & Misi' };

const MISI = [
  'Menyelenggarakan pendidikan keislaman yang berpedoman pada Al-Qur\'an dan Sunnah.',
  'Membina santri untuk memiliki akhlaq mulia dan kepribadian Islam yang kuat.',
  'Mengembangkan ilmu pengetahuan agama dan umum secara terpadu dan berkesinambungan.',
  'Mencetak kader ulama dan pemimpin umat yang siap berkhidmah kepada masyarakat.',
  'Membangun lingkungan pesantren yang kondusif, bersih, nyaman, dan Islami.',
];

export default function VisiMisiPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} /><span className="text-white font-medium">Visi & Misi</span>
          </nav>
          <h1 className="text-white text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Visi & Misi</h1>
          <p className="text-white/70 mt-2">Arah dan tujuan yang menjadi landasan seluruh kegiatan PP Al-Fatich.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {/* Visi */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #169645, #F4B41A)' }} />
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#F0FFF4' }}>
              <Eye size={24} style={{ color: '#169645' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>VISI</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Terwujudnya generasi Islam yang <strong className="text-green-700">beriman</strong>, <strong className="text-green-700">bertaqwa</strong>, <strong className="text-green-700">berakhlaqul karimah</strong>, <strong className="text-green-700">berwawasan luas</strong>, terampil, dan mandiri demi terlaksananya ajaran Islam secara <em>kaffah</em>.
              </p>
            </div>
          </div>
        </div>

        {/* Misi */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #F4B41A, #169645)' }} />
          <div className="flex items-start gap-5 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFFBEB' }}>
              <Target size={24} style={{ color: '#D4970E' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>MISI</h2>
          </div>
          <div className="space-y-4">
            {MISI.map((m, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #169645, #0D5C2B)' }}>
                  {i + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tujuan */}
        <div className="rounded-3xl p-8 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }}>
          <div className="absolute top-4 right-6 text-6xl opacity-10" style={{ fontFamily: 'var(--font-amiri)' }}>بِسْمِ اللهِ</div>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Motto Pesantren</h2>
          <blockquote className="text-white/90 text-xl italic leading-relaxed border-l-4 border-yellow-400 pl-5">
            "Tekun dalam Bertafaqquh fid-Din, Amanah dalam Berkhidmah dan Teguh dalam Perjuangan Agama dan Bangsa."
          </blockquote>
        </div>
      </div>
    </div>
  );
}
