import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// ── Tanya Jawab ──
// GET /api/forum/qa
router.get('/qa', asyncHandler(async (req, res) => {
  const { status, limit = '20', page = '1' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let query = 'SELECT * FROM forum_qa WHERE 1=1';
  const params: unknown[] = [];
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);
  const [rows] = await pool.query(query, params);
  res.json({ success: true, data: rows });
}));

// POST /api/forum/qa
router.post('/qa', asyncHandler(async (req, res) => {
  const { penanya, email, pertanyaan } = req.body;
  if (!penanya || !pertanyaan) {
    res.status(400).json({ success: false, message: 'Nama dan pertanyaan wajib diisi' });
    return;
  }
  const [result] = await pool.query(
    'INSERT INTO forum_qa (penanya, email, pertanyaan) VALUES (?, ?, ?)',
    [penanya, email || null, pertanyaan]
  );
  res.status(201).json({
    success: true,
    message: 'Pertanyaan berhasil dikirim. Kami akan segera membalas.',
    data: { id: (result as { insertId: number }).insertId }
  });
}));

// PUT /api/forum/qa/:id (Answer or update QA)
router.put('/qa/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { jawaban, dijawab_oleh = 'Dewan Asatidz Al-Fatich', status = 'answered', verified = true } = req.body;
  await pool.query(
    'UPDATE forum_qa SET jawaban = ?, dijawab_oleh = ?, status = ?, verified = ?, dijawab_at = NOW() WHERE id = ?',
    [jawaban, dijawab_oleh, status, verified, id]
  );
  res.json({ success: true, message: 'Jawaban konsultasi berhasil diperbarui' });
}));

// DELETE /api/forum/qa/:id
router.delete('/qa/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM forum_qa WHERE id = ?', [id]);
  res.json({ success: true, message: 'Pertanyaan berhasil dihapus' });
}));

// ── Bahtsu Masail ──
// GET /api/forum/bahtsu
router.get('/bahtsu', asyncHandler(async (req, res) => {
  const { kategori, tahun, search, limit = '50' } = req.query;
  let query = 'SELECT * FROM bahtsu_masail WHERE 1=1';
  const params: unknown[] = [];
  if (kategori) { query += ' AND kategori = ?'; params.push(kategori); }
  if (tahun) { query += ' AND tahun = ?'; params.push(Number(tahun)); }
  if (search) { query += ' AND (judul LIKE ? OR deskripsi LIKE ?)'; const s = `%${search}%`; params.push(s, s); }
  query += ' ORDER BY tahun DESC, id DESC LIMIT ?';
  params.push(Number(limit));
  const [rows] = await pool.query(query, params);
  res.json({ success: true, data: rows });
}));

// POST /api/forum/bahtsu
router.post('/bahtsu', asyncHandler(async (req, res) => {
  const { judul, kategori, tahun, deskripsi, file_url } = req.body;
  if (!judul || !deskripsi) {
    res.status(400).json({ success: false, message: 'Judul dan deskripsi wajib diisi' });
    return;
  }
  const [result] = await pool.query(
    'INSERT INTO bahtsu_masail (judul, kategori, tahun, deskripsi, file_url) VALUES (?, ?, ?, ?, ?)',
    [judul, kategori || 'Fiqih Ibadah', Number(tahun) || new Date().getFullYear(), deskripsi, file_url || null]
  );
  res.status(201).json({ success: true, message: 'Data Bahtsu Masail berhasil ditambahkan', data: { id: (result as any).insertId } });
}));

// DELETE /api/forum/bahtsu/:id
router.delete('/bahtsu/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM bahtsu_masail WHERE id = ?', [id]);
  res.json({ success: true, message: 'Dokumen Bahtsu Masail berhasil dihapus' });
}));

// POST /api/forum/bahtsu/:id/download (increment download count)
router.post('/bahtsu/:id/download', asyncHandler(async (req, res) => {
  await pool.query('UPDATE bahtsu_masail SET download_count = download_count + 1 WHERE id = ?', [req.params.id]);
  res.json({ success: true });
}));

export default router;
