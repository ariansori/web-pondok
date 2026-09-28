import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/profil — all key-value pairs
router.get('/', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT key_name, value FROM profil');
  const data = (rows as { key_name: string; value: string }[]).reduce((acc, row) => {
    acc[row.key_name] = row.value;
    return acc;
  }, {} as Record<string, string>);
  res.json({ success: true, data });
}));

// GET /api/profil/sejarah
router.get('/sejarah', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM sejarah ORDER BY sort_order ASC');
  res.json({ success: true, data: rows });
}));

// GET /api/profil/filosofi
router.get('/filosofi', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM filosofi_lambang ORDER BY sort_order ASC');
  res.json({ success: true, data: rows });
}));

export default router;
