import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/stats
router.get('/', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM stats ORDER BY sort_order ASC');
  res.json({ success: true, data: rows });
}));

export default router;
