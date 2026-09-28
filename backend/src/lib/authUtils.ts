import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'alfatich_super_secure_jwt_secret_key_2026';

// ── PBKDF2 Password Hashing ──
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    // Fallback direct check if plain text in dev
    return password === storedHash;
  }
  const [salt, originalHash] = storedHash.split(':');
  const hashToTest = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hashToTest === originalHash;
}

// ── 6-Digit OTP Generator ──
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Lightweight HMAC-SHA256 Token (No external dependency required) ──
export interface TokenPayload {
  id: number;
  email: string;
  nama: string;
  role: 'superadmin' | 'admin';
  exp: number;
}

export function createToken(user: { id: number; email: string; nama: string; role: 'superadmin' | 'admin' }): string {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    nama: user.nama,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60 * 7), // 7 days
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');

    if (signature !== expectedSig) return null;

    const payload: TokenPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // expired
    }
    return payload;
  } catch {
    return null;
  }
}
