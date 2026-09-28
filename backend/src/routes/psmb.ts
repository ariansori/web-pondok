import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// POST /api/psmb — submit registration
router.post('/', asyncHandler(async (req, res) => {
  const {
    nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
    asal_sekolah, jenjang, nama_ayah, nama_ibu, no_hp, alamat
  } = req.body;

  if (!nama_lengkap || !jenis_kelamin || !jenjang || !no_hp) {
    res.status(400).json({ success: false, message: 'Data wajib tidak lengkap' });
    return;
  }

  const validJenjang = ['RA', 'MI', 'MTs', 'MA'];
  if (!validJenjang.includes(jenjang)) {
    res.status(400).json({ success: false, message: 'Jenjang tidak valid' });
    return;
  }

  const [result] = await pool.query(
    `INSERT INTO psmb_registrations 
     (nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, asal_sekolah, jenjang, nama_ayah, nama_ibu, no_hp, alamat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, asal_sekolah, jenjang, nama_ayah, nama_ibu, no_hp, alamat]
  );

  res.status(201).json({
    success: true,
    message: 'Pendaftaran berhasil! Tim kami akan menghubungi Anda segera.',
    data: { id: (result as { insertId: number }).insertId }
  });
}));

// GET /api/psmb — admin list (basic)
router.get('/', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM psmb_registrations ORDER BY created_at DESC LIMIT 200'
  );
  res.json({ success: true, data: rows });
}));

// PUT /api/psmb/:id/status
router.put('/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'diterima', 'ditolak'].includes(status)) {
    res.status(400).json({ success: false, message: 'Status tidak valid' });
    return;
  }
  await pool.query('UPDATE psmb_registrations SET status = ? WHERE id = ?', [status, id]);
  res.json({ success: true, message: `Status santri berhasil diubah menjadi ${status}` });
}));

// DELETE /api/psmb/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM psmb_registrations WHERE id = ?', [id]);
  res.json({ success: true, message: 'Data pendaftar berhasil dihapus' });
}));

export default router;
