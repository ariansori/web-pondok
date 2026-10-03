"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = __importDefault(require("../db/connection"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/stats
router.get('/', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const [rows] = await connection_1.default.query('SELECT * FROM stats ORDER BY sort_order ASC');
        res.json({ success: true, data: rows });
    }
    catch {
        res.json({
            success: true,
            data: [
                { label: 'Jumlah Santri', value: 850, icon: 'Users', sort_order: 1 },
                { label: 'Jumlah Pengajar', value: 45, icon: 'GraduationCap', sort_order: 2 },
                { label: 'Unit Pendidikan', value: 6, icon: 'Building2', sort_order: 3 },
                { label: 'Tahun Berdiri', value: 1988, icon: 'Calendar', sort_order: 4 },
            ]
        });
    }
}));
// PUT /api/stats (Update stats)
router.put('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const body = req.body;
    if (!body) {
        res.status(400).json({ success: false, message: 'Data tidak valid' });
        return;
    }
    // If array of stats [{ id, label, value, ... }]
    if (Array.isArray(body)) {
        for (const stat of body) {
            if (stat.id) {
                await connection_1.default.query('UPDATE stats SET value = ?, label = ? WHERE id = ?', [stat.value, stat.label, stat.id]);
            }
            else if (stat.label) {
                await connection_1.default.query('INSERT INTO stats (label, value, icon, sort_order) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [stat.label, stat.value, stat.icon || 'Users', stat.sort_order || 0]);
            }
        }
    }
    else if (typeof body === 'object') {
        // If key-value object e.g. { total_santri: 850, total_pengajar: 45 }
        for (const [key, val] of Object.entries(body)) {
            const numVal = Number(val);
            if (!isNaN(numVal)) {
                await connection_1.default.query('INSERT INTO profil (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [key, String(numVal)]);
            }
        }
    }
    res.json({ success: true, message: 'Data statistik berhasil diperbarui' });
}));
exports.default = router;
//# sourceMappingURL=stats.js.map