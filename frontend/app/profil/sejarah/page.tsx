'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { fetchSejarah } from '@/lib/api';

const DEFAULT_TIMELINE = [
  { year: 1988, judul: 'Pendirian PP Al-Fatich', desc: 'PP Al-Fatich didirikan oleh KH. Ali Tamam bin Mu\'abih. Abdul Mu\'in bersama istri Nyai Hj. Nah\'ah binti Mbah H. Sa\'id. Berlokasi di Tambak Osowilangun V/10 Kec. Benowo Kota Surabaya. Santri generasi pertama berjumlah 8 anak.' },
  { year: 1990, judul: 'Pembukaan Madrasah Diniyah', desc: 'Dibuka program Madrasah Diniyah resmi untuk mengkaji kitab-kitab turats secara sistematis dengan metode sorogan dan bandongan.' },
  { year: 1995, judul: 'Berdirinya Madrasah Al-Qur\'an', desc: 'Program Tahfidz Al-Qur\'an secara resmi dimulai dengan metode talaqqi berlisensi sanad terpercaya yang bersambung hingga Rasulullah SAW.' },
  { year: 2000, judul: 'Pembukaan RA dan MI Al-Fatich', desc: 'Merespons kebutuhan masyarakat akan pendidikan formal Islami, dibuka Raudhatul Athfal dan Madrasah Ibtidaiyah Al-Fatich.' },
  { year: 2005, judul: 'Berdirinya MTs Al-Fatich', desc: 'Madrasah Tsanawiyah Al-Fatich resmi berdiri sebagai kelanjutan MI, memberikan pendidikan terpadu agama dan umum setingkat SMP.' },
  { year: 2010, judul: 'Pembukaan MA Al-Fatich', desc: 'Madrasah Aliyah Al-Fatich dibuka untuk melengkapi jenjang pendidikan formal hingga setingkat SMA.' },
  { year: 2015, judul: 'Pengembangan Infrastruktur', desc: 'Pembangunan asrama baru, gedung madrasah modern, dan masjid jami\' yang megah untuk menampung semakin banyak santri.' },
  { year: 2020, judul: 'Digitalisasi Pesantren', desc: 'PP Al-Fatich mulai mengadopsi teknologi digital dalam sistem administrasi, pembelajaran, dan komunikasi pesantren.' },
  { year: 2024, judul: 'Peringatan 36 Tahun', desc: 'Merayakan 36 tahun perjalanan pesantren dengan ribuan alumni yang tersebar di seluruh Indonesia dan mancanegara.' },
];

export default function SejarahPage() {
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);

  useEffect(() => {
    fetchSejarah()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            year: Number(item.tahun) || item.year,
            judul: item.judul,
            desc: item.deskripsi || item.desc,
          }));
          setTimeline(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-20 min-h-screen" style={{ background: 'var(--color-off-white)' }}>
      {/* ── Breadcrumb / Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D5C2B, #169645)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/profil" className="hover:text-white">Profil</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Sejarah Singkat</span>
          </nav>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
            Sejarah Singkat PP Al-Fatich
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">Perjalanan panjang sebuah pesantren dalam mendidik generasi Islam sejak 1988.</p>
        </div>
      </div>

      {/* Konten: kiri gambar + narasi, kanan milestone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Kiri: Gambar + Narasi ── */}
          <div className="space-y-8">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img
                src="/images/sejarah-gedung-alfatich.jpg"
                alt="Gedung Pondok Pesantren Al-Fatich"
                className="w-full h-[320px] sm:h-[380px] object-cover bg-green-900"
              />
            </div>

            <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-4">
              <p>
                Seiring dengan perkembangan zaman yang semakin pesat, kebutuhan manusia yang semakin
                banyak dan kompleks termasuk kebutuhan akan pendidikan, maka dunia pendidikan dituntut
                harus mampu menjawab semua kebutuhan tersebut. Diantara lembaga pendidikan yang siap
                menghadapi tuntutan zaman saat ini adalah Pondok Pesantren Al Fatich yang didirikan oleh
                KH. Ali Taman Abdul Mu&rsquo;in diatas area tanah seluas 5 hektar yang akan menjadi
                kebanggaan untuk perkembangan pendidikan di masa depan.
              </p>
              <p>
                Melihat sisi letak geografisnya, Pondok Pesantren Al Fatich terletak di wilayah
                strategis yakni dipinggir jalan raya protokoler yang menghubungkan antara kota Surabaya
                dan Gresik. Pondok Pesantren Al Fatich akan terus menerus tiada henti untuk melakukan
                inovasi dan peningkatan mutu disegala bidang, terutama dalam permasalahan ilmu Diniyah
                (agama) dan ilmu Al Qur&rsquo;an agar dapat mengikuti perkembangan zaman serta akan
                terus berusaha memenuhi tuntutan yang berkembang di masyarakat, baik berupa kegiatan
                belajar mengajar (KBM) maupun sarana prasarana penunjang yang dibutuhkan oleh santri.
              </p>
              <p>
                Pondok Pesantren Al Fatich hadir ditengah-tengah kita, untuk ikut serta menyiapkan
                santri menjadi muslim yang berakhlakul karimah dan berpegang teguh pada ajaran Ahlus
                Sunnah Wal Jama&rsquo;ah serta mempunyai keahlian yang mampu menjawab tantangan zaman.
                Pondok pesantren mempunyai peran yang besar dalam mencerdaskan anak bangsa melalui
                pendidikan agama, sebuah lembaga pendidikan yang keberadaannya jauh sebelum Indonesia
                merdeka. Pondok pesantren lahir berbarengan dengan sejarah awal dakwah Islam di
                Indonesia khususnya di pulau Jawa.
              </p>

              <h2 className="text-lg font-bold text-gray-900 pt-2">
                Dua Kategori Unit Pendidikan
              </h2>
              <p>
                Sebagai lembaga pendidikan, Pondok Pesantren Al-Fatich memiliki dua kategori unit
                pendidikan, yakni:
              </p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Dloruriyat (Keniscayaan)
                </h3>
                <p className="mb-3">
                  Terdiri dari lembaga Madrasah Al-Qur&rsquo;an dan Madrasah Diniyah.
                </p>
                <ul className="list-disc pl-5 space-y-3">
                  <li>
                    <strong>Madrasah Al-Qur&rsquo;an</strong> adalah lembaga pendidikan yang mempelajari
                    tata cara baca tulis Al-Qur&rsquo;an yang baik dan benar. Dalam kegiatan belajar
                    mengajarnya, lembaga ini menggunakan metode Yanbu&rsquo;a dan memiliki program
                    unggulan yakni Tahfidzul Qur&rsquo;an. Dari lembaga ini diharapkan para santri dapat
                    memahami dan mengamalkan cara baca dan tulis Al-Qur&rsquo;an yang tepat.
                  </li>
                  <li>
                    <strong>Madrasah Diniyah</strong> adalah lembaga pendidikan keagamaan di luar
                    sekolah formal yang mempelajari dan mendalami ilmu-ilmu keislaman mulai dari fiqih,
                    nahwu, shorof, dan lainnya melalui beberapa kitab ulama salaf. Lembaga ini memiliki
                    beberapa program pembelajaran antara lain: sorogan, syawir/musyawarah, halaqoh,
                    menghafal nadzom, dan bahtsul masa&rsquo;il.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Hajiyat (Penopang)
                </h3>
                <p className="mb-3">
                  Terdiri dari lembaga formal, antara lain MI, MTs, dan MA.
                </p>
                <ul className="list-disc pl-5 space-y-3">
                  <li>
                    <strong>Pendidikan formal</strong> adalah jalur pendidikan yang terstruktur dan
                    berjenjang, terdiri dari pendidikan anak usia dini, pendidikan dasar, dan pendidikan
                    menengah. Pendidikan formal ini mempelajari wawasan pengetahuan umum (non-Diniyah)
                    mulai dari IPA, IPS, Matematika, dan lain sebagainya.
                  </li>
                </ul>
              </div>

              <p>
                Dalam dunia pesantren tidak sekedar diajarkan tentang pengetahuan-pengetahuan Islam
                ataupun umum, melainkan juga didukung dengan pengembangan potensi kemampuan diri melalui
                kegiatan ekstrakurikuler antara lain Al-Banjari, Kaligrafi, Qiro&rsquo;atul Qur&rsquo;an,
                hingga teknologi digital guna tidak ketinggalan zaman yang perkembangannya sangat pesat
                ini.
              </p>

              <a
                href="https://drive.google.com/file/d/1N7VyLeAr2Vg0wwpzpN1YOFl3MYM1wTqo/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-green inline-flex mt-2"
              >
                <Download size={16} />
                Download E-Book Sejarah
              </a>
            </article>
          </div>

          {/* ── Kanan: Milestone Timeline ── */}
          <div className="lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Milestone Perjalanan</h2>
            <div className="relative pl-8">
              {/* Garis vertikal */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-600 via-yellow-400 to-green-600" />

              <div className="space-y-6">
                {timeline.map((item, i) => (
                  <div key={item.year + '-' + i} className="relative">
                    {/* Bubble */}
                    <div
                      className="absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10"
                      style={{ background: i % 2 === 0 ? '#169645' : '#F4B41A' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div
                        className="text-2xl font-extrabold mb-1"
                        style={{ color: i % 2 === 0 ? '#169645' : '#D4970E' }}
                      >
                        {item.year}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1.5">{item.judul}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}