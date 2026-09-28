import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import profilRoutes from './routes/profil';
import lembagaRoutes from './routes/lembaga';
import agendaRoutes from './routes/agenda';
import maklumatRoutes from './routes/maklumat';
import galeriRoutes from './routes/galeri';
import artikelRoutes from './routes/artikel';
import forumRoutes from './routes/forum';
import psmbRoutes from './routes/psmb';
import statsRoutes from './routes/stats';

import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import adminStatsRoutes from './routes/adminStats';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3500';

// ── Security & Performance Middleware ──
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression() as any);
app.use(morgan('dev'));

// ── CORS ──
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3500', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static Files (uploads) ──
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'alfatich-api' });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/lembaga', lembagaRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/maklumat', maklumatRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/artikel', artikelRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/psmb', psmbRoutes);
app.use('/api/stats', statsRoutes);

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`✅ Al-Fatich API server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
