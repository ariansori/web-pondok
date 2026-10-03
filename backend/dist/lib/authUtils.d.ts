export declare function hashPassword(password: string): string;
export declare function verifyPassword(password: string, storedHash: string): boolean;
export declare function generateOtp(): string;
export interface TokenPayload {
    id: number;
    email: string;
    nama: string;
    role: 'superadmin' | 'admin';
    exp: number;
}
export declare function createToken(user: {
    id: number;
    email: string;
    nama: string;
    role: 'superadmin' | 'admin';
}): string;
export declare function verifyToken(token: string): TokenPayload | null;
//# sourceMappingURL=authUtils.d.ts.map