import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
export interface MaklumatRow extends RowDataPacket {
    id: number;
    judul: string;
    konten: string;
    kategori: 'pengumuman' | 'maklumat' | 'berita';
    penting: number;
    published_at: Date;
    created_at: Date;
    updated_at: Date;
}
export declare const getMaklumats: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMaklumatById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createMaklumat: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateMaklumat: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteMaklumat: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=maklumat.d.ts.map