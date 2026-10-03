'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function ProfilPreview() {
  return (
    <section id="sejarah" className="py-20" style={{ background: 'var(--color-off-white)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Text ── */}
          <div>
            <span className="badge-green mb-4 inline-block">Profil Pesantren</span>
            <h2 className="section-title mb-4">
              Sejarah Singkat<br />
              <span className="text-gradient-green" style={{ WebkitTextFillColor: 'var(--color-green-primary)' }}>
                PP. Al-Fatich Surabaya
              </span>
            </h2>
            <div className="divider-green mb-6" />
            <p className="section-subtitle mb-8">
              Seiring dengan perkembangan zaman yang semakin pesat, kebutuhan manusia yang semakin
              banyak dan kompleks termasuk kebutuhan akan pendidikan, maka dunia pendidikan dituntut
              harus mampu menjawab semua kebutuhan tersebut. Diantara lembaga pendidikan yang siap
              menghadapi tuntutan zaman saat ini adalah Pondok Pesantren Al Fatich yang didirikan oleh
              KH. Ali Taman Abdul Mu&rsquo;in diatas area tanah seluas 5 hektar yang akan menjadi
              kebanggaan untuk perkembangan pendidikan di masa depan. Melihat sisi letak geografisnya,
              Pondok Pesantren Al Fatich terletak di wilayah strategis yakni dipinggir jalan raya
              protokoler yang menghubungkan antara kota Surabaya dan Gresik. Pondok Pesantren Al Fatich
              akan terus menerus tiada henti untuk melakukan inovasi dan peningkatan mutu disegala
              bidang&hellip;
            </p>
            <Link href="/profil/sejarah" className="btn-green inline-flex">
              Baca Selengkapnya <ChevronRight size={16} />
            </Link>
          </div>

          {/* ── Right: Gambar ── */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="/images/sejarah-milestone.jpg"
                alt="Perjalanan Pondok Pesantren Al-Fatich"
                className="w-full h-[420px] object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-4 flex items-center gap-4">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--color-green-primary)' }}>
                1988
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm leading-tight">Sejak Berdiri</p>
                <p className="text-gray-500 text-xs">36+ Tahun Mengabdi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}