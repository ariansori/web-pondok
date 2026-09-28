import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/agenda?status=upcoming&limit=5
router.get('/', asyncHandler(async (req, res) => {
  const { status, limit = '10', kategori } = req.query;
  let query = 'SELECT * FROM agenda WHERE 1=1';
  const params: unknown[] = [];
  if (status) { query += ' AND status = ?'; params.push(status); }
  if (kategori) { query += ' AND kategori = ?'; params.push(kategori); }
  query += ' ORDER BY tanggal_mulai ASC LIMIT ?';
  params.push(Number(limit));
  const [rows] = await pool.query(query, params);
  res.json({ success: true, data: rows });
}));

// GET /api/agenda/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM agenda WHERE id = ?', [req.params.id]);
  const data = (rows as unknown[])[0];
  if (!data) { res.status(404).json({ success: false, message: 'Agenda tidak ditemukan' }); return; }
  res.json({ success: true, data });
}));

// POST /api/agenda
router.post('/', asyncHandler(async (req, res) => {
  const { judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status = 'upcoming' } = req.body;
  if (!judul || !tanggal_mulai) {
    res.status(400).json({ success: false, message: 'Judul dan tanggal mulai wajib diisi' });
    return;
  }
  const [result] = await pool.query(
    'INSERT INTO agenda (judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [judul, deskripsi || '', tanggal_mulai, tanggal_selesai || null, lokasi || '', kategori || 'Umum', status]
  );
  res.status(201).json({ success: true, message: 'Agenda berhasil ditambahkan', data: { id: (result as any).insertId } });
}));

// PUT /api/agenda/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status } = req.body;
  let query = 'UPDATE agenda SET updated_at = NOW()';
  const params: any[] = [];
  if (judul) { query += ', judul = ?'; params.push(judul); }
  if (deskripsi !== undefined) { query += ', deskripsi = ?'; params.push(deskripsi); }
  if (tanggal_mulai) { query += ', tanggal_mulai = ?'; params.push(tanggal_mulai); }
  if (tanggal_selesai !== undefined) { query += ', tanggal_selesai = ?'; params.push(tanggal_selesai || null); }
  if (lokasi !== undefined) { query += ', lokasi = ?'; params.push(lokasi); }
  if (kategori) { query += ', kategori = ?'; params.push(kategori); }
  if (status) { query += ', status = ?'; params.push(status); }
  query += ' WHERE id = ?';
  params.push(id);
  await pool.query(query, params);
  res.json({ success: true, message: 'Agenda berhasil diperbarui' });
}));

// DELETE /api/agenda/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM agenda WHERE id = ?', [id]);
  res.json({ success: true, message: 'Agenda berhasil dihapus' });
}));

export default router;
