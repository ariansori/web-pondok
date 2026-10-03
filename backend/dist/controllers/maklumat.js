"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMaklumat = exports.updateMaklumat = exports.createMaklumat = exports.getMaklumatById = exports.getMaklumats = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const errorHandler_1 = require("../middleware/errorHandler");
exports.getMaklumats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { kategori, limit = '10' } = req.query;
    const conditions = [];
    const params = [];
    let query = 'SELECT * FROM maklumat';
    if (kategori && kategori !== 'all') {
        conditions.push('kategori = ?');
        params.push(String(kategori));
    }
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY penting DESC, published_at DESC LIMIT ?';
    params.push(Number(limit));
    const [rows] = await connection_1.default.query(query, params);
    res.json({ success: true, data: rows });
});
exports.getMaklumatById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [rows] = await connection_1.default.query('SELECT * FROM maklumat WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
        res.status(404).json({ success: false, message: 'Maklumat tidak ditemukan' });
        return;
    }
    res.json({ success: true, data: rows[0] });
});
exports.createMaklumat = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { judul, konten, kategori = 'pengumuman', penting = false } = req.body;
    if (!judul || !konten) {
        res.status(400).json({ success: false, message: 'Judul dan isi maklumat wajib diisi' });
        return;
    }
    const [result] = await connection_1.default.query('INSERT INTO maklumat (judul, konten, kategori, penting, published_at) VALUES (?, ?, ?, ?, NOW())', [judul, konten, kategori, penting ? 1 : 0]);
    res.status(201).json({ success: true, message: 'Maklumat berhasil diterbitkan', data: { id: result.insertId } });
});
exports.updateMaklumat = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const allowedFields = ['judul', 'konten', 'kategori', 'penting'];
    const fieldsToUpdate = [];
    const params = [];
    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            fieldsToUpdate.push(`${field} = ?`);
            // Konversi boolean khusus untuk field 'penting'
            params.push(field === 'penting' ? (updates[field] ? 1 : 0) : updates[field]);
        }
    });
    if (fieldsToUpdate.length === 0) {
        res.status(400).json({ success: false, message: 'Tidak ada data yang diubah' });
        return;
    }
    fieldsToUpdate.push('updated_at = NOW()');
    params.push(id);
    const query = `UPDATE maklumat SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    await connection_1.default.query(query, params);
    res.json({ success: true, message: 'Maklumat berhasil diperbarui' });
});
exports.deleteMaklumat = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await connection_1.default.query('DELETE FROM maklumat WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Maklumat berhasil dihapus' });
});
//# sourceMappingURL=maklumat.js.map