import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/galeri?tipe=foto&kategori=kegiatan
router.get('/', asyncHandler(async (req, res) => {
  const { tipe, kategori, limit = '20' } = req.query;
  let query = 'SELECT * FROM galeri WHERE 1=1';
  const params: unknown[] = [];
  if (tipe) { query += ' AND tipe = ?'; params.push(tipe); }
  if (kategori) { query += ' AND kategori = ?'; params.push(kategori); }
  query += ' ORDER BY tanggal DESC, id DESC LIMIT ?';
  params.push(Number(limit));
  const [rows] = await pool.query(query, params);
  res.json({ success: true, data: rows });
}));
// POST /api/galeri
router.post('/', asyncHandler(async (req, res) => {
  const { judul, deskripsi, tipe = 'foto', url, thumbnail, kategori = 'Kegiatan', tanggal } = req.body;
  if (!judul || !url) {
    res.status(400).json({ success: false, message: 'Judul dan URL foto/video wajib diisi' });
    return;
  }
  const [result] = await pool.query(
    'INSERT INTO galeri (judul, deskripsi, tipe, url, thumbnail, kategori, tanggal) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [judul, deskripsi || '', tipe, url, thumbnail || url, kategori, tanggal || new Date()]
  );
  res.status(201).json({ success: true, message: 'Item galeri berhasil ditambahkan', data: { id: (result as any).insertId } });
}));

// DELETE /api/galeri/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM galeri WHERE id = ?', [id]);
  res.json({ success: true, message: 'Item galeri berhasil dihapus' });
}));

export default router;
