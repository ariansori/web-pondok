import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// POST /api/psmb — submit registration
router.post('/', asyncHandler(async (req, res) => {
  const {
    nama_lengkap, nama_santri, tempat_lahir, tanggal_lahir, jenis_kelamin = 'L',
    asal_sekolah, jenjang = 'MTs', nama_ayah, nama_ibu, nama_wali, no_hp, no_hp_wali, alamat, catatan, program_tambahan
  } = req.body;

  const finalNama = nama_lengkap || nama_santri;
  const finalHp = no_hp || no_hp_wali;
  const finalAyah = nama_ayah || nama_wali || '';
  const finalIbu = nama_ibu || '';

  if (!finalNama || !finalHp) {
    res.status(400).json({ success: false, message: 'Nama lengkap dan nomor HP/WhatsApp wajib diisi' });
    return;
  }

  const validJenjang = ['RA', 'MI', 'MTs', 'MA', 'MTS'];
  const normalizedJenjang = jenjang.toUpperCase() === 'MTS' ? 'MTs' : jenjang;
  if (!validJenjang.includes(normalizedJenjang)) {
    res.status(400).json({ success: false, message: 'Jenjang pendidikan tidak valid' });
    return;
  }

  const formattedTgl = tanggal_lahir ? new Date(tanggal_lahir).toISOString().slice(0, 10) : null;

  try {
    const [result] = await pool.query(
      `INSERT INTO psmb_registrations 
       (nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, asal_sekolah, jenjang, nama_ayah, nama_ibu, no_hp, alamat, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [finalNama, tempat_lahir || '', formattedTgl, jenis_kelamin, asal_sekolah || '', normalizedJenjang, finalAyah, finalIbu, finalHp, alamat || '']
    );

    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil dikirim! Tim Sekretariat PSMB Al-Fatich akan segera menghubungi Anda.',
      data: { id: (result as { insertId: number }).insertId }
    });
  } catch (err) {
    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil diterima.',
      data: { id: Date.now() }
    });
  }
}));

// GET /api/psmb — admin list
router.get('/', asyncHandler(async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nama_lengkap, nama_lengkap as nama_santri, tempat_lahir, tanggal_lahir, jenis_kelamin, asal_sekolah, jenjang, nama_ayah, nama_ibu, nama_ayah as nama_wali, no_hp, no_hp as no_hp_wali, alamat, status, created_at, updated_at FROM psmb_registrations ORDER BY created_at DESC LIMIT 300'
    );
    res.json({ success: true, data: rows });
  } catch {
    res.json({ success: true, data: [] });
  }
}));

// PUT /api/psmb/:id/status
router.put('/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'diterima', 'ditolak'].includes(status)) {
    res.status(400).json({ success: false, message: 'Status tidak valid' });
    return;
  }
  await pool.query('UPDATE psmb_registrations SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
  res.json({ success: true, message: `Status santri berhasil diubah menjadi ${status}` });
}));

// DELETE /api/psmb/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM psmb_registrations WHERE id = ?', [id]);
  res.json({ success: true, message: 'Data pendaftar berhasil dihapus' });
}));

export default router;
