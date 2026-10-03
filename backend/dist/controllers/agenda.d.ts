import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
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
export declare const getAgendas: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getAgendaById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createAgenda: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateAgenda: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteAgenda: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=agenda.d.ts.map