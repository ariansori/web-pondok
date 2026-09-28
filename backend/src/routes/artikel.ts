import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/artikel?kategori=Pendidikan&published=true
router.get('/', asyncHandler(async (req, res) => {
  const { kategori, limit = '10', page = '1' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let query = 'SELECT id, judul, slug, ringkasan, penulis, kategori, thumbnail, published_at, view_count FROM artikel WHERE published = TRUE';
  const params: unknown[] = [];
  if (kategori) { query += ' AND kategori = ?'; params.push(kategori); }
  query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);
  const [rows] = await pool.query(query, params);
  const [countRows] = await pool.query('SELECT COUNT(*) as total FROM artikel WHERE published = TRUE');
  const total = (countRows as { total: number }[])[0].total;
  res.json({ success: true, data: rows, meta: { total, page: Number(page), limit: Number(limit) } });
}));

// GET /api/artikel/:slug
router.get('/:slug', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM artikel WHERE slug = ?', [req.params.slug]);
  const data = (rows as unknown[])[0];
  if (!data) { res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' }); return; }
  await pool.query('UPDATE artikel SET view_count = view_count + 1 WHERE slug = ?', [req.params.slug]);
  res.json({ success: true, data });
}));

// POST /api/artikel (Create new article)
router.post('/', asyncHandler(async (req, res) => {
  const { judul, konten, ringkasan, penulis = 'Dewan Asatidz', kategori = 'Keislaman', tags, published = true } = req.body;
  if (!judul || !konten) {
    res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi' });
    return;
  }
  const slug = req.body.slug || judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  const [result] = await pool.query(
    'INSERT INTO artikel (judul, slug, konten, ringkasan, penulis, kategori, tags, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
    [judul, slug, konten, ringkasan || konten.slice(0, 160), penulis, kategori, tags || '', published]
  );
  res.status(201).json({ success: true, message: 'Artikel berhasil diterbitkan', data: { id: (result as any).insertId, slug } });
}));

// PUT /api/artikel/:id (Update article)
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { judul, konten, ringkasan, penulis, kategori, tags, published } = req.body;
  let query = 'UPDATE artikel SET updated_at = NOW()';
  const params: any[] = [];
  if (judul) { query += ', judul = ?'; params.push(judul); }
  if (konten) { query += ', konten = ?'; params.push(konten); }
  if (ringkasan) { query += ', ringkasan = ?'; params.push(ringkasan); }
  if (penulis) { query += ', penulis = ?'; params.push(penulis); }
  if (kategori) { query += ', kategori = ?'; params.push(kategori); }
  if (tags !== undefined) { query += ', tags = ?'; params.push(tags); }
  if (published !== undefined) { query += ', published = ?'; params.push(published); }
  query += ' WHERE id = ?';
  params.push(id);
  await pool.query(query, params);
  res.json({ success: true, message: 'Artikel berhasil diperbarui' });
}));

// DELETE /api/artikel/:id (Delete article)
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM artikel WHERE id = ?', [id]);
  res.json({ success: true, message: 'Artikel berhasil dihapus' });
}));

export default router;
