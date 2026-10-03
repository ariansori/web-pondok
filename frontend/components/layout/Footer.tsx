import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: 'linear-gradient(135deg, #0D5C2B 0%, #0a4a22 50%, #083a1a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1: Identity ── */}
          <div className="lg:col-span-1">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden mb-4">
              <Image
                src="/lambang-alfatich.png"
                alt="Logo Pondok Pesantren Al-Fatich"
                width={100}
                height={100}
                className="object-contain w-full h-full p-0.5"
                priority
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5 italic">
              &ldquo;Tekun dalam Bertafaqquh fid-Din, Amanah dalam Berkhidmah dan Teguh dalam Perjuangan Agama dan Bangsa.&rdquo;
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="https://youtube.com/@alfatich" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-yellow-400 text-white/70 hover:text-gray-900 transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://instagram.com/alfatich.surabaya" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-yellow-400 text-white/70 hover:text-gray-900 transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://facebook.com/alfatichsurabaya" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-yellow-400 text-white/70 hover:text-gray-900 transition-all duration-200 hover:scale-110">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            </div>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-yellow-400 inline-block" />
              Link Terkait
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Sejarah Pesantren', href: '/profil/sejarah' },
                { label: 'Lembaga Pendidikan', href: '/lembaga' },
                { label: 'Agenda & Kegiatan', href: '/informasi/agenda' },
                { label: 'Galeri Foto', href: '/informasi/galeri' },
                { label: 'Tour Pesantren', href: '/informasi/tour' },
                { label: 'Forum & Artikel', href: '/artikel' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-white/60 hover:text-yellow-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-green-400 group-hover:bg-yellow-400 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Lembaga ── */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-yellow-400 inline-block" />
              Unit Pendidikan
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Madrasah Al-Qur\'an', href: '/lembaga' },
                { label: 'Madrasah Diniyah', href: '/lembaga' },
                { label: 'RA Al-Fatich', href: '/lembaga' },
                { label: 'MI Al-Fatich', href: '/lembaga' },
                { label: 'MTs Al-Fatich', href: '/lembaga' },
                { label: 'MA Al-Fatich', href: '/lembaga' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-white/60 hover:text-yellow-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-green-400 group-hover:bg-yellow-400 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Link href="/psmb"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-900 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #F4B41A, #D4970E)' }}>
                Daftar PSMB →
              </Link>
            </div>
          </div>

          {/* ── Col 4: Contact ── */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-yellow-400 inline-block" />
              Kontak Kami
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/60 text-sm leading-relaxed">
                  Jl. Tambak Osowilangun No. 98,<br />
                  Kec. Benowo, Kota Surabaya,<br />
                  Jawa Timur 60191
                </p>
              </div>
              <a href="tel:+6281758427600" className="flex items-center gap-3 text-white/60 hover:text-yellow-400 text-sm transition-colors group">
                <Phone size={16} className="text-yellow-400 flex-shrink-0" />
                081-758-4276
              </a>
              <a href="mailto:pondokpesantrenalfattichsurabaya@gmail.com"
                className="flex items-center gap-3 text-white/60 hover:text-yellow-400 text-sm transition-colors group break-all">
                <Mail size={16} className="text-yellow-400 flex-shrink-0" />
                alfatich@gmail.com
              </a>
              {/* Google Maps embed */}
              <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src="https://maps.google.com/maps?q=Jl.+Tambak+Osowilangun+No.98+Surabaya&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="140"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Lokasi PP Al-Fatich Surabaya"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm text-center sm:text-left">
            © {currentYear} Pondok Pesantren Al-Fatich Surabaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
