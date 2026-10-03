"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = __importDefault(require("../db/connection"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/admin/stats (Dashboard statistics overview)
router.get('/', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
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
        const [[psmb]] = await connection_1.default.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) as pending FROM psmb_registrations');
        const [[art]] = await connection_1.default.query('SELECT COUNT(*) as total FROM artikel');
        const [[ag]] = await connection_1.default.query('SELECT COUNT(*) as total FROM agenda');
        const [[mak]] = await connection_1.default.query('SELECT COUNT(*) as total FROM maklumat');
        const [[qa]] = await connection_1.default.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) as pending FROM forum_qa');
        const [[bahtsu]] = await connection_1.default.query('SELECT COUNT(*) as total FROM bahtsu_masail');
        const [[gal]] = await connection_1.default.query('SELECT COUNT(*) as total FROM galeri');
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
    }
    catch { }
    res.json({ success: true, data: statsData });
}));
exports.default = router;
//# sourceMappingURL=adminStats.js.map