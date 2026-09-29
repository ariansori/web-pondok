import { Request, Response } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface MaklumatRow extends RowDataPacket {
    id: number;
    judul: string;
    konten: string;
    kategori: 'pengumuman' | 'maklumat' | 'berita';
    penting: number; // MySQL menyimpan boolean sebagai TINYINT (0 atau 1)
    published_at: Date;
    created_at: Date;
    updated_at: Date;
}

export const getMaklumats = asyncHandler(async (req: Request, res: Response) => {
    const { kategori, limit = '10' } = req.query;

    const conditions: string[] = [];
    const params: (string | number)[] = [];
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

    const [rows] = await pool.query<MaklumatRow[]>(query, params);
    res.json({ success: true, data: rows });
});

export const getMaklumatById = asyncHandler(async (req: Request, res: Response) => {
    const [rows] = await pool.query<MaklumatRow[]>('SELECT * FROM maklumat WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
        res.status(404).json({ success: false, message: 'Maklumat tidak ditemukan' });
        return;
    }

    res.json({ success: true, data: rows[0] });
});

export const createMaklumat = asyncHandler(async (req: Request, res: Response) => {
    const { judul, konten, kategori = 'pengumuman', penting = false } = req.body;

    if (!judul || !konten) {
        res.status(400).json({ success: false, message: 'Judul dan isi maklumat wajib diisi' });
        return;
    }

    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO maklumat (judul, konten, kategori, penting, published_at) VALUES (?, ?, ?, ?, NOW())',
        [judul, konten, kategori, penting ? 1 : 0]
    );

    res.status(201).json({ success: true, message: 'Maklumat berhasil diterbitkan', data: { id: result.insertId } });
});

export const updateMaklumat = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['judul', 'konten', 'kategori', 'penting'];
    const fieldsToUpdate: string[] = [];
    const params: any[] = [];

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
    await pool.query<ResultSetHeader>(query, params);

    res.json({ success: true, message: 'Maklumat berhasil diperbarui' });
});

export const deleteMaklumat = asyncHandler(async (req: Request, res: Response) => {
    await pool.query<ResultSetHeader>('DELETE FROM maklumat WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Maklumat berhasil dihapus' });
});