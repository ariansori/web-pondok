'use client';

// Ganti ID ini kalau video profilnya berubah
const YOUTUBE_VIDEO_ID = 'iRHr5CHTRyk';

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#111111' }}
    >
      {/* ── Background Video ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Poster: fallback saat video belum load & untuk prefers-reduced-motion */}
        <div
        />

        {/* Video YouTube di-scale supaya selalu penuh (cover), disembunyikan untuk reduced motion */}
        <iframe
          className="motion-reduce:hidden absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`}
          title="Video profil Pondok Pesantren Al-Fatich"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />

        {/* Overlay gelap supaya teks putih tetap kontras */}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* ── Konten Tengah ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
        {/* Kaligrafi Arab */}
        <img
          src="/kaligrafi-alfatich.png"
          alt="المعهد الإسلامي السلفي الفاتح"
          className="mx-auto w-full max-w-xl h-auto mb-8 select-none"
          draggable={false}
        />

        {/* Judul */}
        <h1
          className="text-white font-bold uppercase tracking-wide mb-6"
          style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Pondok Pesantren Al-Fatich
        </h1>

        {/* Tagline */}
        <p className="text-white/90 italic text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          &ldquo;Tekun dalam Bertafaqquh fid&ndash;Din, Amanah dalam Berkhidmah dan Teguh dalam Perjuangan Agama dan Bangsa.&rdquo;
        </p>
      </div>
    </section>
  );
}