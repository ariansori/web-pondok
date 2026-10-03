"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = __importDefault(require("../db/connection"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/profil — all key-value pairs
router.get('/', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const [rows] = await connection_1.default.query('SELECT key_name, value FROM profil');
        const data = rows.reduce((acc, row) => {
            acc[row.key_name] = row.value;
            return acc;
        }, {});
        res.json({ success: true, data });
    }
    catch {
        res.json({ success: true, data: {} });
    }
}));
// PUT /api/profil — update or insert key-value pairs
router.put('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
        res.status(400).json({ success: false, message: 'Data tidak valid' });
        return;
    }
    for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
            await connection_1.default.query('INSERT INTO profil (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [key, String(value)]);
        }
    }
    res.json({ success: true, message: 'Profil pesantren berhasil diperbarui' });
}));
// GET /api/profil/sejarah
router.get('/sejarah', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const [rows] = await connection_1.default.query('SELECT * FROM sejarah ORDER BY sort_order ASC, tahun ASC');
        res.json({ success: true, data: rows });
    }
    catch {
        res.json({ success: true, data: [] });
    }
}));
// GET /api/profil/filosofi
router.get('/filosofi', (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    try {
        const [rows] = await connection_1.default.query('SELECT * FROM filosofi_lambang ORDER BY sort_order ASC');
        res.json({ success: true, data: rows });
    }
    catch {
        res.json({ success: true, data: [] });
    }
}));
exports.default = router;
//# sourceMappingURL=profil.js.map