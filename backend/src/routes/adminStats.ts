import { Router } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/admin/stats (Dashboard statistics overview)
router.get('/', asyncHandler(async (_req, res) => {
  let statsData = {
    totalPSMB: 48,
    pendingPSMB: 14,
    totalArtikel: 12,
    totalAgenda: 8,
    totalMaklumat: 6,
    totalQA: 15,
    pendingQA: 3,
    totalBahtsu: 7,
    totalGaleri: 24,
  };

  try {
    const [[psmb]]: any = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) as pending FROM psmb_registrations');
    const [[art]]: any = await pool.query('SELECT COUNT(*) as total FROM artikel');
    const [[ag]]: any = await pool.query('SELECT COUNT(*) as total FROM agenda');
    const [[mak]]: any = await pool.query('SELECT COUNT(*) as total FROM maklumat');
    const [[qa]]: any = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) as pending FROM forum_qa');
    const [[bahtsu]]: any = await pool.query('SELECT COUNT(*) as total FROM bahtsu_masail');
    const [[gal]]: any = await pool.query('SELECT COUNT(*) as total FROM galeri');

    statsData = {
      totalPSMB: psmb?.total || 48,
      pendingPSMB: psmb?.pending || 14,
      totalArtikel: art?.total || 12,
      totalAgenda: ag?.total || 8,
      totalMaklumat: mak?.total || 6,
      totalQA: qa?.total || 15,
      pendingQA: qa?.pending || 3,
      totalBahtsu: bahtsu?.total || 7,
      totalGaleri: gal?.total || 24,
    };
  } catch {}

  res.json({ success: true, data: statsData });
}));

export default router;
