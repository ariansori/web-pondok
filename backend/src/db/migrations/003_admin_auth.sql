USE alfatich_db;

-- ── Users & Admin Authentication Table ──
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
  email_verified BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT TRUE,
  otp_code VARCHAR(10) NULL,
  otp_expires_at TIMESTAMP NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires TIMESTAMP NULL,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Seed Initial Superadmin & Admin ──
-- Note: Password hash format: salt:hash using PBKDF2 sha512 for password '@Alfatich1989.'
INSERT INTO users (nama, email, password, role, email_verified, two_factor_enabled, aktif)
VALUES 
(
  'Super Admin Al-Fatich', 
  'pondokputraaf@gmail.com', 
  'e6c4a8f910d2b3c4:c1d6837943588da6ebc517208ef7d78a8767fe5f6d6aa6498be5d985a9757f4955f1f0a1ea370335e806c9a449fc078e6c78a05c3fb14ec81016d9a101b0460c', 
  'superadmin', 
  TRUE, 
  TRUE, 
  TRUE
),
(
  'Admin Redaksi Konten', 
  'admin@alfatich.ponpes.id', 
  'e6c4a8f910d2b3c4:c1d6837943588da6ebc517208ef7d78a8767fe5f6d6aa6498be5d985a9757f4955f1f0a1ea370335e806c9a449fc078e6c78a05c3fb14ec81016d9a101b0460c', 
  'admin', 
  TRUE, 
  TRUE, 
  TRUE
)
ON DUPLICATE KEY UPDATE 
  nama = VALUES(nama),
  password = VALUES(password),
  role = VALUES(role),
  aktif = VALUES(aktif);
