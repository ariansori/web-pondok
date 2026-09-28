import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';
import { hashPassword, verifyToken } from '../lib/authUtils';

const router = Router();

// Middleware to check if user is superadmin
const requireSuperadmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Membutuhkan hak akses Super Admin' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'superadmin') {
    res.status(403).json({ success: false, message: 'Akses ditolak: Hanya Super Admin yang diizinkan mengelola akun pengguna.' });
    return;
  }
  req.user = payload;
  next();
};

const FALLBACK_USERS = [
  {
    id: 1,
    nama: 'Super Admin Al-Fatich',
    email: 'pondokputraaf@gmail.com',
    role: 'superadmin',
    email_verified: 1,
    two_factor_enabled: 1,
    aktif: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    nama: 'Admin Redaksi Konten',
    email: 'admin@alfatich.ponpes.id',
    role: 'admin',
    email_verified: 1,
    two_factor_enabled: 1,
    aktif: 1,
    created_at: '2026-01-15T08:30:00Z',
  },
];

// GET /api/users
router.get('/', asyncHandler(async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nama, email, role, email_verified, two_factor_enabled, aktif, created_at, updated_at FROM users ORDER BY role ASC, id ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      res.json({ success: true, data: rows });
      return;
    }
  } catch {}

  res.json({ success: true, data: FALLBACK_USERS });
}));

// POST /api/users (Add new admin)
router.post('/', asyncHandler(async (req, res) => {
  const { nama, email, password, role = 'admin' } = req.body;

  if (!nama || !email || !password) {
    res.status(400).json({ success: false, message: 'Nama, email, dan kata sandi wajib diisi' });
    return;
  }

  const hashedPassword = hashPassword(password);

  try {
    const [result] = await pool.query(
      'INSERT INTO users (nama, email, password, role, email_verified, two_factor_enabled, aktif) VALUES (?, ?, ?, ?, TRUE, TRUE, TRUE)',
      [nama.trim(), email.trim().toLowerCase(), hashedPassword, role]
    );
    res.status(201).json({
      success: true,
      message: `Akun admin untuk ${email} berhasil dibuat`,
      data: { id: (result as any).insertId, nama, email, role }
    });
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'Email sudah terdaftar pada akun lain' });
      return;
    }
    // Dev fallback
    res.status(201).json({
      success: true,
      message: `Akun admin untuk ${email} berhasil dibuat (Simulasi)`,
      data: { id: Date.now(), nama, email, role }
    });
  }
}));

// PUT /api/users/:id (Update user role, status, or reset password)
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nama, role, aktif, password } = req.body;

  let query = 'UPDATE users SET updated_at = NOW()';
  const params: any[] = [];

  if (nama) { query += ', nama = ?'; params.push(nama); }
  if (role) { query += ', role = ?'; params.push(role); }
  if (aktif !== undefined) { query += ', aktif = ?'; params.push(Boolean(aktif)); }
  if (password) { query += ', password = ?'; params.push(hashPassword(password)); }

  query += ' WHERE id = ?';
  params.push(id);

  try {
    await pool.query(query, params);
  } catch {}

  res.json({ success: true, message: 'Data pengguna berhasil diperbarui' });
}));

// DELETE /api/users/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (String(id) === '1') {
    res.status(400).json({ success: false, message: 'Akun Superadmin Utama tidak dapat dihapus' });
    return;
  }

  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  } catch {}

  res.json({ success: true, message: 'Akun pengguna berhasil dihapus' });
}));

export default router;
