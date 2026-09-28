-- ============================================================
-- Al-Fatich Database Migration v1.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS alfatich_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE alfatich_db;

-- ── Stats ──
CREATE TABLE IF NOT EXISTS stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  label VARCHAR(100) NOT NULL,
  label_en VARCHAR(100),
  value INT NOT NULL DEFAULT 0,
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Profil Pesantren ──
CREATE TABLE IF NOT EXISTS profil (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Lembaga Pendidikan ──
CREATE TABLE IF NOT EXISTS lembaga (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(200) NOT NULL,
  singkatan VARCHAR(50),
  kategori ENUM('dloruriyat', 'hajiyat') NOT NULL,
  deskripsi TEXT,
  kurikulum TEXT,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Agenda ──
CREATE TABLE IF NOT EXISTS agenda (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(300) NOT NULL,
  deskripsi TEXT,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  lokasi VARCHAR(200),
  kategori VARCHAR(100),
  status ENUM('upcoming', 'ongoing', 'done') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Maklumat ──
CREATE TABLE IF NOT EXISTS maklumat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(300) NOT NULL,
  konten TEXT NOT NULL,
  kategori ENUM('pengumuman', 'maklumat', 'berita') DEFAULT 'pengumuman',
  penting BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Galeri ──
CREATE TABLE IF NOT EXISTS galeri (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(300) NOT NULL,
  deskripsi TEXT,
  tipe ENUM('foto', 'video') DEFAULT 'foto',
  url VARCHAR(500) NOT NULL,
  thumbnail VARCHAR(500),
  kategori VARCHAR(100),
  tanggal DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Artikel ──
CREATE TABLE IF NOT EXISTS artikel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  konten LONGTEXT NOT NULL,
  ringkasan TEXT,
  thumbnail VARCHAR(500),
  penulis VARCHAR(200),
  kategori VARCHAR(100),
  tags VARCHAR(500),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Forum Q&A ──
CREATE TABLE IF NOT EXISTS forum_qa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  penanya VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  pertanyaan TEXT NOT NULL,
  jawaban TEXT,
  dijawab_oleh VARCHAR(200),
  dijawab_at TIMESTAMP NULL,
  status ENUM('pending', 'answered', 'closed') DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Bahtsu Masail ──
CREATE TABLE IF NOT EXISTS bahtsu_masail (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(500) NOT NULL,
  kategori VARCHAR(200),
  tahun INT,
  deskripsi TEXT,
  file_url VARCHAR(500),
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── PSMB Registrations ──
CREATE TABLE IF NOT EXISTS psmb_registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_lengkap VARCHAR(300) NOT NULL,
  tempat_lahir VARCHAR(200),
  tanggal_lahir DATE,
  jenis_kelamin ENUM('L', 'P') NOT NULL,
  asal_sekolah VARCHAR(300),
  jenjang ENUM('RA', 'MI', 'MTs', 'MA') NOT NULL,
  nama_ayah VARCHAR(300),
  nama_ibu VARCHAR(300),
  no_hp VARCHAR(20) NOT NULL,
  alamat TEXT,
  status ENUM('pending', 'diterima', 'ditolak') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Sejarah Timeline ──
CREATE TABLE IF NOT EXISTS sejarah (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tahun INT NOT NULL,
  judul VARCHAR(300) NOT NULL,
  deskripsi TEXT,
  sort_order INT DEFAULT 0
);

-- ── Filosofi Lambang ──
CREATE TABLE IF NOT EXISTS filosofi_lambang (
  id INT PRIMARY KEY AUTO_INCREMENT,
  simbol VARCHAR(200) NOT NULL,
  makna TEXT NOT NULL,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0
);
