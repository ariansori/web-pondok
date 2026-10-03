"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.generateOtp = generateOtp;
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET = process.env.JWT_SECRET || 'alfatich_super_secure_jwt_secret_key_2026';
// ── PBKDF2 Password Hashing ──
function hashPassword(password) {
    const salt = crypto_1.default.randomBytes(16).toString('hex');
    const hash = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}
function verifyPassword(password, storedHash) {
    if (!storedHash || !storedHash.includes(':')) {
        // Fallback direct check if plain text in dev
        return password === storedHash;
    }
    const [salt, originalHash] = storedHash.split(':');
    const hashToTest = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hashToTest === originalHash;
}
// ── 6-Digit OTP Generator ──
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function createToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60 * 7), // 7 days
    };
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto_1.default.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    return `${header}.${body}.${signature}`;
}
function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const [header, body, signature] = parts;
        const expectedSig = crypto_1.default.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
        if (signature !== expectedSig)
            return null;
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null; // expired
        }
        return payload;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=authUtils.js.map