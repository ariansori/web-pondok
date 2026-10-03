export const PSMB_DEADLINE = '31 Agustus 2026';
export const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN || '6281234567890';
export const SITE_NAME = 'Pondok Pesantren Salafi Al-Fatich Surabaya';
export const SITE_TAGLINE = 'Mencetak Generasi Qur\'ani, Berakhlaqul Karimah, dan Berwawasan Luas';

export const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Profil',
    href: '/profil',
    children: [
      { label: 'Hub Profil', href: '/profil' },
      { label: 'Sejarah Singkat', href: '/profil/sejarah' },
      { label: 'Biografi Pendiri', href: '/profil/pendiri' },
      { label: 'Filosofi Lambang', href: '/profil/filosofi' },
      { label: 'Visi & Misi', href: '/profil/visi-misi' },
      { label: 'Struktur Organisasi', href: '/profil/struktur' },
      { label: 'Identitas Pesantren', href: '/profil/identitas' },
    ],
  },
  {
    label: 'Lembaga',
    href: '/lembaga',
    children: [
      { label: 'Semua Lembaga', href: '/lembaga' },
      { label: 'Madrasah Al-Qur\'an (MAQ)', href: '/lembaga' },
      { label: 'Madrasah Diniyah (MD)', href: '/lembaga' },
      { label: 'Raudhatul Athfal (RA)', href: '/lembaga' },
      { label: 'Madrasah Ibtidaiyah (MI)', href: '/lembaga' },
      { label: 'Madrasah Tsanawiyah (MTs)', href: '/lembaga' },
      { label: 'Madrasah Aliyah (MA)', href: '/lembaga' },
    ],
  },
  {
    label: 'Informasi',
    href: '/informasi',
    children: [
      { label: 'Agenda & Acara', href: '/informasi/agenda' },
      { label: 'Maklumat & Pengumuman', href: '/informasi/maklumat' },
      { label: 'Galeri Foto & Video', href: '/informasi/galeri' },
      { label: 'Virtual Tour 360°', href: '/informasi/tour' },
    ],
  },
  {
    label: 'Khazanah',
    href: '/artikel',
    children: [
      { label: 'Artikel & Opini', href: '/artikel' },
      { label: 'Bahtsu Masail', href: '/forum/bahtsu-masail' },
      { label: 'Tanya Jawab Syariah', href: '/forum/tanya-jawab' },
    ],
  },
  { label: 'PSMB', href: '/psmb' },
];

export const CAMPUS_HOTSPOTS = [
  {
    id: 1,
    label: 'Masjid Jami\' Al-Fatich',
    icon: '🕌',
    top: '25%',
    left: '42%',
    desc: 'Pusat peribadatan shalat berjamaah 5 waktu, pengajian kitab kuning bandongan ba\'da Maghrib & Shubuh, serta halaqah tahfidzul Qur\'an.',
    kapasitas: '1.200 Jamaah',
    kegiatan: 'Shalat Fardhu, Diniyah, Maulid Nabi, Khutbah Jum\'at',
  },
  {
    id: 2,
    label: 'Asrama Putra (Kompleks A)',
    icon: '🏠',
    top: '50%',
    left: '20%',
    desc: 'Kompleks asrama santri putra dengan kamar yang bersih, ventilasi memadai, lemari santri mandiri, dan pengawasan asatidz 24 jam.',
    kapasitas: '450 Santri',
    kegiatan: 'Kajian Malam, Istirahat, Kebersihan Harian',
  },
  {
    id: 3,
    label: 'Asrama Putri (Kompleks B)',
    icon: '🏠',
    top: '50%',
    left: '66%',
    desc: 'Kompleks asrama santri putri dengan sistem keamanan tertutup, fasilitas dapur higienis, musholla putri, dan area belajar mandiri.',
    kapasitas: '400 Santriwati',
    kegiatan: 'Tahfidz Putri, Halaqah Adab, Mudzakarah',
  },
  {
    id: 4,
    label: 'Gedung Madrasah Terpadu',
    icon: '🏫',
    top: '40%',
    left: '52%',
    desc: 'Gedung kelas 3 lantai ber-AC dan multimedia untuk KBM formal RA, MI, MTs, dan MA Al-Fatich.',
    kapasitas: '24 Ruang Kelas',
    kegiatan: 'Pendidikan Formal Kemenag, Lab Komputer, Lab IPA',
  },
  {
    id: 5,
    label: 'Kantin & Dapur Umum Santri',
    icon: '🍽️',
    top: '65%',
    left: '37%',
    desc: 'Penyediaan konsumsi harian bergizi 3x sehari untuk santri mukim dengan standar kebersihan terjaga.',
    kapasitas: 'Pelayanan Harian',
    kegiatan: 'Makan Bersama, Koperasi Santri, Air Minum Higienis',
  },
  {
    id: 6,
    label: 'Gedung Ndalem & Kantor Sekretariat',
    icon: '🏛️',
    top: '20%',
    left: '57%',
    desc: 'Kediaman Pengasuh Pesantren, kantor pimpinan yayasan, sekretariat PSMB, dan ruang penerimaan tamu wali santri.',
    kapasitas: 'Ruang Pertemuan Khusus',
    kegiatan: 'Konsultasi Wali Santri, Pelayanan PSMB, Rapat Pengurus',
  },
  {
    id: 7,
    label: 'Perpustakaan Turats & Kitab Kuning',
    icon: '📖',
    top: '35%',
    left: '27%',
    desc: 'Koleksi ribuan judul kitab kuning klasik (turats), ensiklopedia fiqih, tafsir, hadits, serta literatur kontemporer.',
    kapasitas: '3.500+ Judul Kitab',
    kegiatan: 'Muthala\'ah, Riset Bahtsul Masa\'il, Baca Mandiri',
  },
];
