// backend/src/controllers/agenda.ts
import { Request, Response } from 'express';
import pool from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface AgendaRow extends RowDataPacket {
    id: number;
    judul: string;
    deskripsi: string;
    tanggal_mulai: Date;
    tanggal_selesai: Date | null;
    lokasi: string | null;
    kategori: string | null;
    status: 'upcoming' | 'ongoing' | 'done';
}

export const getAgendas = asyncHandler(async (req: Request, res: Response) => {
    const { status, limit = '10', kategori } = req.query;

    const conditions: string[] = [];
    const params: (string | number)[] = [];
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

    const [rows] = await pool.query<AgendaRow[]>(query, params);
    res.json({ success: true, data: rows });
});

export const getAgendaById = asyncHandler(async (req: Request, res: Response) => {
    const [rows] = await pool.query<AgendaRow[]>('SELECT * FROM agenda WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
        res.status(404).json({ success: false, message: 'Agenda tidak ditemukan' });
        return;
    }

    res.json({ success: true, data: rows[0] });
});

export const createAgenda = asyncHandler(async (req: Request, res: Response) => {
    const { judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status = 'upcoming' } = req.body;

    if (!judul || !tanggal_mulai) {
        res.status(400).json({ success: false, message: 'Judul dan tanggal mulai wajib diisi' });
        return;
    }

    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO agenda (judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [judul, deskripsi || '', tanggal_mulai, tanggal_selesai || null, lokasi || '', kategori || 'Umum', status]
    );

    res.status(201).json({ success: true, message: 'Agenda berhasil ditambahkan', data: { id: result.insertId } });
});

export const updateAgenda = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'kategori', 'status'];
    const fieldsToUpdate: string[] = [];
    const params: any[] = [];

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
    await pool.query<ResultSetHeader>(query, params);

    res.json({ success: true, message: 'Agenda berhasil diperbarui' });
});

export const deleteAgenda = asyncHandler(async (req: Request, res: Response) => {
    await pool.query<ResultSetHeader>('DELETE FROM agenda WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Agenda berhasil dihapus' });
});