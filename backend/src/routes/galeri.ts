import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/galeri?tipe=foto&kategori=kegiatan
router.get('/', asyncHandler(async (req, res) => {
  const { tipe, kategori, limit = '50' } = req.query;
  let query = 'SELECT * FROM galeri WHERE 1=1';
  const params: unknown[] = [];
  if (tipe && tipe !== 'Semua' && tipe !== 'all') {
    query += ' AND tipe = ?';
    params.push(String(tipe).toLowerCase());
  }
  if (kategori && kategori !== 'Semua' && kategori !== 'all') {
    query += ' AND kategori = ?';
    params.push(kategori);
  }
  query += ' ORDER BY tanggal DESC, id DESC LIMIT ?';
  params.push(Number(limit));
  
  try {
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch {
    res.json({ success: true, data: [] });
  }
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

// PUT /api/galeri/:id (Update gallery item)
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, tipe, url, thumbnail, kategori, tanggal } = req.body;

  let query = 'UPDATE galeri SET ';
  const updates: string[] = [];
  const params: any[] = [];

  if (judul !== undefined) { updates.push('judul = ?'); params.push(judul); }
  if (deskripsi !== undefined) { updates.push('deskripsi = ?'); params.push(deskripsi); }
  if (tipe !== undefined) { updates.push('tipe = ?'); params.push(tipe); }
  if (url !== undefined) { updates.push('url = ?'); params.push(url); }
  if (thumbnail !== undefined) { updates.push('thumbnail = ?'); params.push(thumbnail); }
  if (kategori !== undefined) { updates.push('kategori = ?'); params.push(kategori); }
  if (tanggal !== undefined) { updates.push('tanggal = ?'); params.push(tanggal); }

  if (updates.length === 0) {
    res.status(400).json({ success: false, message: 'Tidak ada data yang diubah' });
    return;
  }

  query += updates.join(', ') + ' WHERE id = ?';
  params.push(id);

  await pool.query(query, params);
  res.json({ success: true, message: 'Item galeri berhasil diperbarui' });
}));

// DELETE /api/galeri/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM galeri WHERE id = ?', [id]);
  res.json({ success: true, message: 'Item galeri berhasil dihapus' });
}));

export default router;
