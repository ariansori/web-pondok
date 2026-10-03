"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = __importDefault(require("../db/connection"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/lembaga
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { kategori } = req.query;
    let query = 'SELECT * FROM lembaga WHERE aktif = TRUE';
    const params = [];
    if (kategori && (kategori === 'dloruriyat' || kategori === 'hajiyat')) {
        query += ' AND kategori = ?';
        params.push(kategori);
    }
    query += ' ORDER BY sort_order ASC';
    const [rows] = await connection_1.default.query(query, params);
    res.json({ success: true, data: rows });
}));
// GET /api/lembaga/:id
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [rows] = await connection_1.default.query('SELECT * FROM lembaga WHERE id = ?', [req.params.id]);
    const data = rows[0];
    if (!data) {
        res.status(404).json({ success: false, message: 'Lembaga tidak ditemukan' });
        return;
    }
    res.json({ success: true, data });
}));
exports.default = router;
//# sourceMappingURL=lembaga.js.map