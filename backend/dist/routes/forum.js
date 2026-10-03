"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = __importDefault(require("../db/connection"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// ── Tanya Jawab ──
// GET /api/forum/qa
router.get('/qa', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status, limit = '50', page = '1' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = 'SELECT * FROM forum_qa WHERE 1=1';
    const params = [];
    if (status && status !== 'semua' && status !== 'all') {
        if (status === 'dijawab' || status === 'answered') {
            query += ' AND (status = "answered" OR status = "dijawab")';
        }
        else if (status === 'pending') {
            query += ' AND status = "pending"';
        }
        else if (status === 'ditolak' || status === 'closed') {
            query += ' AND (status = "closed" OR status = "ditolak")';
        }
        else {
            query += ' AND status = ?';
            params.push(status);
        }
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);
    try {
        const [rows] = await connection_1.default.query(query, params);
        res.json({ success: true, data: rows });
    }
    catch {
        res.json({ success: true, data: [] });
    }
}));
// POST /api/forum/qa
router.post('/qa', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { penanya, email, pertanyaan } = req.body;
    if (!penanya || !pertanyaan) {
        res.status(400).json({ success: false, message: 'Nama dan pertanyaan wajib diisi' });
        return;
    }
    const [result] = await connection_1.default.query('INSERT INTO forum_qa (penanya, email, pertanyaan) VALUES (?, ?, ?)', [penanya, email || null, pertanyaan]);
    res.status(201).json({
        success: true,
        message: 'Pertanyaan berhasil dikirim. Kami akan segera membalas.',
        data: { id: result.insertId }
    });
}));
// PUT /api/forum/qa/:id (Answer or update QA)
router.put('/qa/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { jawaban, dijawab_oleh = 'Dewan Asatidz Al-Fatich', status = 'answered', verified = true } = req.body;
    const mappedStatus = (status === 'dijawab' || status === 'answered') ? 'answered' : (status === 'ditolak' ? 'closed' : status);
    await connection_1.default.query('UPDATE forum_qa SET jawaban = ?, dijawab_oleh = ?, status = ?, verified = ?, dijawab_at = NOW() WHERE id = ?', [jawaban, dijawab_oleh, mappedStatus, verified ? 1 : 0, id]);
    res.json({ success: true, message: 'Jawaban konsultasi berhasil diperbarui' });
}));
// DELETE /api/forum/qa/:id
router.delete('/qa/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await connection_1.default.query('DELETE FROM forum_qa WHERE id = ?', [id]);
    res.json({ success: true, message: 'Pertanyaan berhasil dihapus' });
}));
// ── Bahtsu Masail ──
// GET /api/forum/bahtsu
router.get('/bahtsu', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { kategori, tahun, search, limit = '50' } = req.query;
    let query = 'SELECT * FROM bahtsu_masail WHERE 1=1';
    const params = [];
    if (kategori && kategori !== 'Semua Kategori' && kategori !== 'all') {
        query += ' AND kategori = ?';
        params.push(kategori);
    }
    if (tahun && tahun !== 'Semua Tahun' && tahun !== 'all') {
        query += ' AND tahun = ?';
        params.push(Number(tahun));
    }
    if (search) {
        query += ' AND (judul LIKE ? OR deskripsi LIKE ?)';
        const s = `%${search}%`;
        params.push(s, s);
    }
    query += ' ORDER BY tahun DESC, id DESC LIMIT ?';
    params.push(Number(limit));
    try {
        const [rows] = await connection_1.default.query(query, params);
        res.json({ success: true, data: rows });
    }
    catch {
        res.json({ success: true, data: [] });
    }
}));
// POST /api/forum/bahtsu
router.post('/bahtsu', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { judul, kategori = 'Fiqih Ibadah', tahun = new Date().getFullYear(), deskripsi, tashawwur, hukum, dalil, referensi, file_url } = req.body;
    let fullDeskripsi = deskripsi;
    if (!fullDeskripsi && (tashawwur || hukum)) {
        fullDeskripsi = [
            tashawwur ? `Tashawwur: ${tashawwur}` : '',
            hukum ? `Hukum: ${hukum}` : '',
            dalil ? `Dalil: ${dalil}` : '',
            referensi ? `Referensi: ${referensi}` : ''
        ].filter(Boolean).join('\n\n');
    }
    if (!judul || !fullDeskripsi) {
        res.status(400).json({ success: false, message: 'Judul dan pembahasan bahtsu masail wajib diisi' });
        return;
    }
    const [result] = await connection_1.default.query('INSERT INTO bahtsu_masail (judul, kategori, tahun, deskripsi, file_url) VALUES (?, ?, ?, ?, ?)', [judul, kategori, Number(tahun), fullDeskripsi, file_url || null]);
    res.status(201).json({ success: true, message: 'Data Bahtsu Masail berhasil ditambahkan', data: { id: result.insertId } });
}));
// PUT /api/forum/bahtsu/:id (Update Bahtsu Masail)
router.put('/bahtsu/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { judul, kategori, tahun, deskripsi, tashawwur, hukum, dalil, referensi, file_url } = req.body;
    let fullDeskripsi = deskripsi;
    if (!fullDeskripsi && (tashawwur || hukum)) {
        fullDeskripsi = [
            tashawwur ? `Tashawwur: ${tashawwur}` : '',
            hukum ? `Hukum: ${hukum}` : '',
            dalil ? `Dalil: ${dalil}` : '',
            referensi ? `Referensi: ${referensi}` : ''
        ].filter(Boolean).join('\n\n');
    }
    const updates = [];
    const params = [];
    if (judul !== undefined) {
        updates.push('judul = ?');
        params.push(judul);
    }
    if (kategori !== undefined) {
        updates.push('kategori = ?');
        params.push(kategori);
    }
    if (tahun !== undefined) {
        updates.push('tahun = ?');
        params.push(Number(tahun));
    }
    if (fullDeskripsi !== undefined) {
        updates.push('deskripsi = ?');
        params.push(fullDeskripsi);
    }
    if (file_url !== undefined) {
        updates.push('file_url = ?');
        params.push(file_url);
    }
    if (updates.length === 0) {
        res.status(400).json({ success: false, message: 'Tidak ada data yang diubah' });
        return;
    }
    const query = `UPDATE bahtsu_masail SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);
    await connection_1.default.query(query, params);
    res.json({ success: true, message: 'Dokumen Bahtsu Masail berhasil diperbarui' });
}));
// DELETE /api/forum/bahtsu/:id
router.delete('/bahtsu/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await connection_1.default.query('DELETE FROM bahtsu_masail WHERE id = ?', [id]);
    res.json({ success: true, message: 'Dokumen Bahtsu Masail berhasil dihapus' });
}));
// POST /api/forum/bahtsu/:id/download (increment download count)
router.post('/bahtsu/:id/download', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    await connection_1.default.query('UPDATE bahtsu_masail SET download_count = download_count + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=forum.js.map