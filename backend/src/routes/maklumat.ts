import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/maklumat?kategori=pengumuman
router.get('/', asyncHandler(async (req, res) => {
  const { kategori, limit = '10' } = req.query;
  let query = 'SELECT * FROM maklumat WHERE 1=1';
  const params: unknown[] = [];
  if (kategori) { query += ' AND kategori = ?'; params.push(kategori); }
  query += ' ORDER BY penting DESC, published_at DESC LIMIT ?';
  params.push(Number(limit));
  const [rows] = await pool.query(query, params);
  res.json({ success: true, data: rows });
}));

// GET /api/maklumat/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM maklumat WHERE id = ?', [req.params.id]);
  const data = (rows as unknown[])[0];
  if (!data) { res.status(404).json({ success: false, message: 'Maklumat tidak ditemukan' }); return; }
  res.json({ success: true, data });
}));

// POST /api/maklumat
router.post('/', asyncHandler(async (req, res) => {
  const { judul, konten, kategori = 'pengumuman', penting = false } = req.body;
  if (!judul || !konten) {
    res.status(400).json({ success: false, message: 'Judul dan isi maklumat wajib diisi' });
    return;
  }
  const [result] = await pool.query(
    'INSERT INTO maklumat (judul, konten, kategori, penting, published_at) VALUES (?, ?, ?, ?, NOW())',
    [judul, konten, kategori, Boolean(penting)]
  );
  res.status(201).json({ success: true, message: 'Maklumat berhasil diterbitkan', data: { id: (result as any).insertId } });
}));

// PUT /api/maklumat/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { judul, konten, kategori, penting } = req.body;
  let query = 'UPDATE maklumat SET updated_at = NOW()';
  const params: any[] = [];
  if (judul) { query += ', judul = ?'; params.push(judul); }
  if (konten) { query += ', konten = ?'; params.push(konten); }
  if (kategori) { query += ', kategori = ?'; params.push(kategori); }
  if (penting !== undefined) { query += ', penting = ?'; params.push(Boolean(penting)); }
  query += ' WHERE id = ?';
  params.push(id);
  await pool.query(query, params);
  res.json({ success: true, message: 'Maklumat berhasil diperbarui' });
}));

// DELETE /api/maklumat/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM maklumat WHERE id = ?', [id]);
  res.json({ success: true, message: 'Maklumat berhasil dihapus' });
}));

export default router;
