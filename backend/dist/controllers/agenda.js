"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgenda = exports.updateAgenda = exports.createAgenda = exports.getAgendaById = exports.getAgendas = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const errorHandler_1 = require("../middleware/errorHandler");
exports.getAgendas = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status, limit = '10', kategori } = req.query;
    const conditions = [];
    const params = [];
    let query = 'SELECT * FROM agenda';
    if (status) {
        conditions.push('status = ?');
        params.push(String(status));
    }
    if (kategori && kategori !== 'Semua') {
        conditions.push('kategori = ?');
        params.push(String(kategori));
    }
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY tanggal_mulai ASC LIMIT ?';
    params.push(Number(limit));
    const [rows] = await connection_1.default.query(query, params);
    res.json({ success: true, data: rows });
});
exports.getAgendaById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [rows] = await connection_1.default.query('SELECT * FROM agenda WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
        res.status(404).json({ success: false, message: 'Agenda tidak ditemukan' });
        return;
    }
    res.json({ success: true, data: rows[0] });
});
exports.createAgenda = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status = 'upcoming' } = req.body;
    if (!judul || !tanggal_mulai) {
        res.status(400).json({ success: false, message: 'Judul dan tanggal mulai wajib diisi' });
        return;
    }
    const [result] = await connection_1.default.query('INSERT INTO agenda (judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [judul, deskripsi || '', tanggal_mulai, tanggal_selesai || null, lokasi || '', kategori || 'Umum', status]);
    res.status(201).json({ success: true, message: 'Agenda berhasil ditambahkan', data: { id: result.insertId } });
});
exports.updateAgenda = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const allowedFields = ['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'kategori', 'status'];
    const fieldsToUpdate = [];
    const params = [];
    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            fieldsToUpdate.push(`${field} = ?`);
            params.push(field === 'tanggal_selesai' && updates[field] === '' ? null : updates[field]);
        }
    });
    if (fieldsToUpdate.length === 0) {
        res.status(400).json({ success: false, message: 'Tidak ada data yang diubah' });
        return;
    }
    fieldsToUpdate.push('updated_at = NOW()');
    params.push(id);
    const query = `UPDATE agenda SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    await connection_1.default.query(query, params);
    res.json({ success: true, message: 'Agenda berhasil diperbarui' });
});
exports.deleteAgenda = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await connection_1.default.query('DELETE FROM agenda WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Agenda berhasil dihapus' });
});
//# sourceMappingURL=agenda.js.map