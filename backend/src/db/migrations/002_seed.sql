USE alfatich_db;

-- ── Stats ──
INSERT INTO stats (label, value, icon, sort_order) VALUES
('Jumlah Santri', 1250, 'users', 1),
('Jumlah Pengajar', 87, 'graduation-cap', 2),
('Unit Pendidikan', 6, 'building', 3),
('Tahun Berdiri', 1988, 'calendar', 4)
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- ── Profil ──
INSERT INTO profil (key_name, value) VALUES
('nama', 'Pondok Pesantren Salafi Al-Fatich'),
('tagline', 'Tekun dalam Bertafaqquh fid-Din, Amanah dalam Berkhidmah dan Teguh dalam Perjuangan Agama dan Bangsa.'),
('alamat', 'Jl. Tambak Osowilangun No. 98, Kec. Benowo, Kota Surabaya, Jawa Timur 60191'),
('telepon', '081-758-4276'),
('email', 'pondokpesantrenalfattichsurabaya@gmail.com'),
('whatsapp', '6281758427600'),
('instagram', 'https://instagram.com/alfatich.surabaya'),
('facebook', 'https://facebook.com/alfatichsurabaya'),
('youtube', 'https://youtube.com/@alfatich'),
('maps_url', 'https://maps.google.com/?q=Jl.+Tambak+Osowilangun+No.98+Surabaya'),
('visi', 'Terwujudnya generasi Islam yang beriman, bertaqwa, berakhlaqul karimah, berwawasan luas, terampil, dan mandiri demi terlaksananya ajaran Islam secara kaffah.'),
('misi_1', 'Menyelenggarakan pendidikan keislaman yang berpedoman pada Al-Qur''an dan Sunnah.'),
('misi_2', 'Membina santri untuk memiliki akhlaq mulia dan kepribadian Islam yang kuat.'),
('misi_3', 'Mengembangkan ilmu pengetahuan agama dan umum secara terpadu dan berkesinambungan.'),
('misi_4', 'Mencetak kader ulama dan pemimpin umat yang siap berkhidmah kepada masyarakat.'),
('misi_5', 'Membangun lingkungan pesantren yang kondusif, bersih, nyaman, dan Islami.'),
('tahun_berdiri', '1988'),
('pendiri', 'KH. Ali Tamam bin Mu''abih. Abdul Mu''in'),
('lokasi_kelurahan', 'Tambak Osowilangun'),
('lokasi_kecamatan', 'Benowo'),
('lokasi_kota', 'Surabaya')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- ── Lembaga ──
INSERT INTO lembaga (nama, singkatan, kategori, deskripsi, kurikulum, icon, sort_order) VALUES
('Madrasah Al-Qur''an', 'MAQ', 'dloruriyat', 
 'Program unggulan hafalan dan pemahaman Al-Qur''an secara mendalam dengan metode talaqqi yang bersambung sanadnya.', 
 'Tahfidz Al-Qur''an 30 Juz, Tajwid, Qira''ah Sab''ah, Tafsir Al-Qur''an', 
 'quran', 1),
('Madrasah Diniyah', 'MD', 'dloruriyat', 
 'Lembaga pendidikan agama Islam yang mengkaji kitab-kitab turats (klasik) secara sistematis dan mendalam.', 
 'Fiqih, Aqidah, Nahwu-Sharaf, Balaghah, Hadits, Ushul Fiqih, Tafsir', 
 'book', 2),
('Raudhatul Athfal', 'RA', 'hajiyat', 
 'Pendidikan anak usia dini (4-6 tahun) dengan nuansa Islami yang menyenangkan dan stimulatif.', 
 'Kurikulum Kemenag RI, Pengenalan Huruf Hijaiyah, Doa Harian, Akhlaq Dasar', 
 'star', 3),
('Madrasah Ibtidaiyah', 'MI', 'hajiyat', 
 'Setingkat SD dengan kurikulum terpadu antara ilmu agama dan ilmu umum berbasis Kementerian Agama.', 
 'Kurikulum Kemenag, Bahasa Arab, Fiqih, SKI, Al-Qur''an-Hadits, IPAS, Matematika', 
 'school', 4),
('Madrasah Tsanawiyah', 'MTs', 'hajiyat', 
 'Setingkat SMP dengan pendalaman ilmu agama dan penguasaan ilmu pengetahuan modern secara berimbang.', 
 'Kurikulum Kemenag, Bahasa Arab, Aqidah, Fiqih, SKI, IPA, IPS, Matematika, Bahasa Inggris', 
 'layers', 5),
('Madrasah Aliyah', 'MA', 'hajiyat', 
 'Setingkat SMA dengan program keislaman lanjutan dan persiapan menuju perguruan tinggi.', 
 'Kurikulum Kemenag, Ushul Fiqih, Tafsir, Hadits, Bahasa Arab Lanjutan, Sains, Sosial, Bahasa', 
 'award', 6)
ON DUPLICATE KEY UPDATE nama = VALUES(nama);

-- ── Agenda ──
INSERT INTO agenda (judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status) VALUES
('Penerimaan Santri Murid Baru (PSMB) Tahun Ajaran 2026/2027', 
 'Pembukaan pendaftaran santri baru untuk semua jenjang pendidikan di PP Al-Fatich.', 
 '2026-07-01', '2026-08-31', 'Gedung Utama PP Al-Fatich', 'PSMB', 'ongoing'),
('Khataman Al-Qur''an & Haflah Akhirussanah', 
 'Acara wisuda hafidz/hafidzah dan khataman Al-Qur''an bagi santri tahfidz.', 
 '2026-10-15', '2026-10-16', 'Masjid Jami'' Al-Fatich', 'Keagamaan', 'upcoming'),
('Peringatan Maulid Nabi Muhammad SAW', 
 'Peringatan hari lahir Nabi Muhammad SAW dengan rangkaian pengajian dan shalawat.', 
 '2026-09-26', '2026-09-26', 'Aula PP Al-Fatich', 'Keagamaan', 'upcoming'),
('Lomba Cerdas Cermat Diniyah Antar Pesantren', 
 'Kompetisi ilmu agama antar santri pesantren se-Surabaya.', 
 '2026-11-05', '2026-11-06', 'PP Al-Fatich Surabaya', 'Akademik', 'upcoming'),
('Pesantren Kilat Ramadhan 1448H', 
 'Program intensif keislaman selama bulan Ramadhan untuk santri dan pelajar umum.', 
 '2027-03-01', '2027-03-20', 'PP Al-Fatich', 'Keagamaan', 'upcoming');

-- ── Maklumat ──
INSERT INTO maklumat (judul, konten, kategori, penting) VALUES
('PSMB Tahun Ajaran 2026/2027 Resmi Dibuka', 
 'Assalamu''alaikum Wr. Wb.\n\nDengan mengucap Bismillahirrahmanirrahim, Pondok Pesantren Salafi Al-Fatich resmi membuka Penerimaan Santri Murid Baru (PSMB) untuk Tahun Ajaran 2026/2027.\n\nPendaftaran dibuka mulai tanggal 1 Juli s/d 31 Agustus 2026. Informasi lebih lanjut hubungi admin pesantren.', 
 'pengumuman', TRUE),
('Jadwal Ujian Akhir Semester Gasal 2025/2026', 
 'Berikut adalah jadwal Ujian Akhir Semester (UAS) Gasal untuk semua jenjang pendidikan di PP Al-Fatich. Harap santri mempersiapkan diri dengan sebaik-baiknya.', 
 'pengumuman', FALSE),
('Pelaksanaan Haul Akbar PP Al-Fatich', 
 'Dalam rangka Haul Akbar Pondok Pesantren Al-Fatich, seluruh santri diwajibkan hadir dalam rangkaian kegiatan yang telah dijadwalkan. Kegiatan akan berlangsung selama 2 hari.', 
 'maklumat', TRUE),
('Panduan Protokol Kesehatan di Lingkungan Pesantren', 
 'Demi menjaga kesehatan bersama, seluruh santri dan tamu diwajibkan mengikuti protokol kesehatan yang berlaku di lingkungan Pondok Pesantren Al-Fatich.', 
 'maklumat', FALSE);

-- ── Artikel ──
INSERT INTO artikel (judul, slug, konten, ringkasan, penulis, kategori, published, published_at) VALUES
('Metode Talaqqi: Warisan Sanad Keilmuan Islam yang Tak Lekang Waktu',
 'metode-talaqqi-warisan-sanad-keilmuan-islam',
 'Talaqqi adalah metode pembelajaran Al-Qur''an secara langsung face-to-face antara guru dan murid. Metode ini telah menjadi tulang punggung transmisi ilmu dalam peradaban Islam sejak masa Rasulullah SAW hingga kini.\n\nDi Pondok Pesantren Al-Fatich, metode talaqqi diterapkan sebagai standar utama dalam pengajaran Al-Qur''an di Madrasah Al-Qur''an. Setiap santri mendapatkan bimbingan langsung dari ustadz yang memiliki sanad bersambung hingga Rasulullah SAW.',
 'Talaqqi adalah metode pembelajaran Al-Qur''an secara langsung yang telah menjadi tulang punggung transmisi ilmu Islam sejak zaman Rasulullah.',
 'Ust. Ahmad Fauzan, Lc.',
 'Pendidikan',
 TRUE, NOW()),
('Pentingnya Kitab Kuning dalam Pembentukan Faqih yang Komprehensif',
 'pentingnya-kitab-kuning-pembentukan-faqih',
 'Kitab kuning atau kitab turats merupakan warisan intelektual ulama terdahulu yang tak ternilai harganya. Di pesantren salafi seperti Al-Fatich, kajian kitab kuning menjadi pondasi utama dalam pembentukan santri yang faqih (memahami agama secara mendalam).\n\nBeberapa kitab yang dikaji di PP Al-Fatich antara lain: Fathul Qarib, Kifayatul Akhyar, Riyadhus Shalihin, Alfiyah Ibn Malik, dan banyak lagi.',
 'Kitab kuning merupakan warisan intelektual ulama yang tak ternilai dan menjadi pondasi utama di pesantren salafi seperti Al-Fatich.',
 'KH. Ali Tamam',
 'Keislaman',
 TRUE, NOW()),
('Akhlaq sebagai Pondasi Utama Pendidikan di PP Al-Fatich',
 'akhlaq-pondasi-utama-pendidikan-al-fatich',
 'Imam Al-Ghazali berkata: "Al-Akhlaq hiya haiah rasikha fin-nafs tatshuduru anha al-af''al bi-suhulatin wa yusrin". Akhlaq adalah kondisi jiwa yang mantap yang darinya lahir perbuatan-perbuatan secara mudah dan spontan.\n\nDi PP Al-Fatich, pembinaan akhlaq bukan sekadar pelajaran di kelas, melainkan kehidupan nyata 24 jam sehari. Santri dibimbing untuk menjadikan akhlaq karimah sebagai karakter yang melekat dalam diri.',
 'Pembinaan akhlaq di PP Al-Fatich bukan sekadar pelajaran kelas, melainkan kehidupan nyata 24 jam yang membentuk karakter sejati.',
 'Ny. Hj. Maknah (Pengasuh)',
 'Pendidikan',
 TRUE, NOW());

-- ── Bahtsu Masail ──
INSERT INTO bahtsu_masail (judul, kategori, tahun, deskripsi) VALUES
('Hukum Shalat Jum''at via Live Streaming', 'Fiqih Ibadah', 2024, 'Kajian mendalam mengenai keabsahan shalat Jum''at yang dilaksanakan melalui siaran langsung di era digital.'),
('Zakat Saham dan Investasi Digital dalam Perspektif Fiqih Kontemporer', 'Fiqih Muamalat', 2024, 'Pembahasan hukum zakat atas saham, reksa dana, dan aset digital berdasarkan qiyas fiqih klasik.'),
('Hukum Jual Beli NFT dan Cryptocurrency dalam Islam', 'Fiqih Muamalat', 2023, 'Analisis hukum Islam terhadap transaksi NFT dan aset kripto yang semakin marak.'),
('Kedudukan Talak via Pesan Singkat (SMS/WhatsApp)', 'Fiqih Munakahat', 2023, 'Telaah hukum perceraian yang diucapkan melalui media digital berdasarkan pandangan mazhab empat.'),
('Hukum Berobat dengan Terapi Gen dan Rekayasa Genetika', 'Fiqih Kedokteran', 2022, 'Kajian etika dan hukum Islam terkait rekayasa genetika dalam dunia kedokteran modern.');

-- ── Sejarah ──
INSERT INTO sejarah (tahun, judul, deskripsi, sort_order) VALUES
(1988, 'Pendirian Pondok Pesantren Al-Fatich', 
 'PP Al-Fatich didirikan oleh KH. Ali Tamam bin Mu''abih. Abdul Mu''in bersama istri yang senantiasa mendampinginya Nyai Hj. Nah''ah binti Mbah H. Sa''id. Berlokasi di Tambak Osowilangun V/10 Kec. Benowo Kota Surabaya dengan 8 santri generasi pertama.', 1),
(1990, 'Pembukaan Madrasah Diniyah', 
 'Dibuka program Madrasah Diniyah resmi untuk mengkaji kitab-kitab turats secara sistematis dengan metode sorogan dan bandongan.', 2),
(1995, 'Berdirinya Madrasah Al-Qur''an', 
 'Program Tahfidz Al-Qur''an secara resmi dimulai dengan metode talaqqi berlisensi sanad terpercaya.', 3),
(2000, 'Pembukaan RA dan MI Al-Fatich', 
 'Merespons kebutuhan masyarakat akan pendidikan formal Islami, dibuka Raudhatul Athfal dan Madrasah Ibtidaiyah Al-Fatich.', 4),
(2005, 'Berdirinya MTs Al-Fatich', 
 'Madrasah Tsanawiyah Al-Fatich resmi berdiri sebagai kelanjutan MI, memberikan pendidikan terpadu agama dan umum setingkat SMP.', 5),
(2010, 'Pembukaan MA Al-Fatich', 
 'Madrasah Aliyah Al-Fatich dibuka untuk melengkapi jenjang pendidikan formal hingga setingkat SMA.', 6),
(2015, 'Renovasi dan Pengembangan Infrastruktur', 
 'Pembangunan asrama baru, gedung madrasah modern, dan masjid jami'' yang megah untuk menampung semakin banyak santri.', 7),
(2020, 'Digitalisasi Pesantren', 
 'PP Al-Fatich mulai mengadopsi teknologi digital dalam sistem administrasi, pembelajaran, dan komunikasi.', 8),
(2024, 'Peringatan 36 Tahun PP Al-Fatich', 
 'Merayakan 36 tahun perjalanan pesantren dengan ribuan alumni yang tersebar di seluruh Indonesia dan mancanegara.', 9);

-- ── Filosofi Lambang ──
INSERT INTO filosofi_lambang (simbol, makna, icon, sort_order) VALUES
('Ka''bah', 'Simbol kiblat umat Islam dan pusat peribadatan, melambangkan orientasi pesantren yang selalu berpedoman pada ajaran Islam yang bersumber dari Makkah Al-Mukarramah.', 'kaaba', 1),
('Kitab Suci Al-Qur''an', 'Melambangkan bahwa PP Al-Fatich menjadikan Al-Qur''an sebagai sumber utama ilmu, pedoman hidup, dan pilar utama seluruh kegiatan pendidikan.', 'book-open', 2),
('Pena', 'Simbol keilmuan, kepenulisan, dan tradisi intelektual Islam. Melambangkan semangat para santri dalam menimba dan menyebarkan ilmu.', 'pen', 3),
('Menara Masjid', 'Melambangkan keagungan Islam, seruan dakwah (adzan), dan tekad pesantren dalam menjaga syi''ar agama Islam.', 'tower', 4),
('Bola Dunia', 'Melambangkan wawasan global santri Al-Fatich yang tidak hanya menguasai ilmu agama, namun juga siap menghadapi tantangan dunia modern.', 'globe', 5);
