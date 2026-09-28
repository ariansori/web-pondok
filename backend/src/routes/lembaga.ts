import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/lembaga
router.get('/', asyncHandler(async (req, res) => {
  const { kategori } = req.query;
  let query = 'SELECT * FROM lembaga WHERE aktif = TRUE';
  const params: string[] = [];
  if (kategori && (kategori === 'dloruriyat' || kategori === 'hajiyat')) {
    query += ' AND kategori = ?';
    params.push(kategori as string);
  }
  query += ' ORDER BY sort_order ASC';
  const [rows] = await pool.query(query, params);
  res.json({ success: true, data: rows });
}));

// GET /api/lembaga/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM lembaga WHERE id = ?', [req.params.id]);
  const data = (rows as unknown[])[0];
  if (!data) { res.status(404).json({ success: false, message: 'Lembaga tidak ditemukan' }); return; }
  res.json({ success: true, data });
}));

export default router;
