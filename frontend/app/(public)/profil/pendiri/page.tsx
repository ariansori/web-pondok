import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Bio Pendiri' };

export default function PendiriPage() {
  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} /><span className="text-white font-medium">Bio Pendiri</span>
          </nav>
          <h1 className="text-white text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Bio Pendiri</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Photo/Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center sticky top-24">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
                style={{ background: 'linear-gradient(135deg, #169645, #0D5C2B)' }}>
                👳
              </div>
              <h2 className="font-bold text-gray-900 text-xl mb-1">KH. Ali Tamam bin Mu'abih. Abdul Mu'in</h2>
              <p className="text-green-700 font-semibold text-sm mb-3">Pendiri & Pengasuh PP Al-Fatich</p>
              <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                <p>Pendiri sejak <strong>1988</strong></p>
                <p className="mt-1">Tambak Osowilangun, Surabaya</p>
              </div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-green-700 text-lg mb-3">Latar Belakang</h3>
              <p className="text-gray-600 leading-relaxed">
                KH. Ali Tamam bin Mu'abih. Abdul Mu'in adalah seorang ulama kharismatik yang mendedikasikan seluruh hidupnya untuk pendidikan Islam. Beliau lahir dan besar di lingkungan pesantren, sehingga semangat keilmuan Islam telah mengakar dalam dirinya sejak kecil.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-green-700 text-lg mb-3">Mendirikan Al-Fatich</h3>
              <p className="text-gray-600 leading-relaxed">
                Pada tahun 1988, bersama sang istri tercinta <strong>Nyai Hj. Nah'ah binti Mbah H. Sa'id</strong>, beliau mendirikan Pondok Pesantren Al-Fatich di Tambak Osowilangun V/10 Kecamatan Benowo Kota Surabaya. Diawali dengan 8 santri generasi pertama, pesantren ini tumbuh menjadi lembaga pendidikan Islam yang disegani.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-green-700 text-lg mb-3">Visi & Komitmen</h3>
              <p className="text-gray-600 leading-relaxed">
                Beliau berkomitmen menjadikan Al-Fatich sebagai pesantren salafi yang tidak hanya mewarisi tradisi keilmuan Islam klasik melalui kajian kitab kuning, tetapi juga mempersiapkan santri untuk menghadapi tantangan zaman modern dengan wawasan yang luas dan akhlaq yang mulia.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="font-bold text-yellow-600 text-lg mb-3">Filosofi Kepemimpinan</h3>
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-gray-600 leading-relaxed">
                "Tekun dalam Bertafaqquh fid-Din, Amanah dalam Berkhidmah dan Teguh dalam Perjuangan Agama dan Bangsa."
              </blockquote>
              <p className="text-gray-500 text-sm mt-3">— Motto PP Al-Fatich yang dicetuskan oleh pendiri</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
