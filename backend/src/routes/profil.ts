import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/profil — all key-value pairs
router.get('/', asyncHandler(async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT key_name, value FROM profil');
    const data = (rows as { key_name: string; value: string }[]).reduce((acc, row) => {
      acc[row.key_name] = row.value;
      return acc;
    }, {} as Record<string, string>);
    res.json({ success: true, data });
  } catch {
    res.json({ success: true, data: {} });
  }
}));

// PUT /api/profil — update or insert key-value pairs
router.put('/', asyncHandler(async (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    res.status(400).json({ success: false, message: 'Data tidak valid' });
    return;
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      await pool.query(
        'INSERT INTO profil (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        [key, String(value)]
      );
    }
  }

  res.json({ success: true, message: 'Profil pesantren berhasil diperbarui' });
}));

// GET /api/profil/sejarah
router.get('/sejarah', asyncHandler(async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sejarah ORDER BY sort_order ASC, tahun ASC');
    res.json({ success: true, data: rows });
  } catch {
    res.json({ success: true, data: [] });
  }
}));

// GET /api/profil/filosofi
router.get('/filosofi', asyncHandler(async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM filosofi_lambang ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch {
    res.json({ success: true, data: [] });
  }
}));

export default router;
