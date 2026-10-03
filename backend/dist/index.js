"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./middleware/errorHandler");
const profil_1 = __importDefault(require("./routes/profil"));
const lembaga_1 = __importDefault(require("./routes/lembaga"));
const agenda_1 = __importDefault(require("./routes/agenda"));
const maklumat_1 = __importDefault(require("./routes/maklumat"));
const galeri_1 = __importDefault(require("./routes/galeri"));
const artikel_1 = __importDefault(require("./routes/artikel"));
const forum_1 = __importDefault(require("./routes/forum"));
const psmb_1 = __importDefault(require("./routes/psmb"));
const stats_1 = __importDefault(require("./routes/stats"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const adminStats_1 = __importDefault(require("./routes/adminStats"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3500';
// ── Security & Performance Middleware ──
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
// ── CORS ──
app.use((0, cors_1.default)({
    origin: [FRONTEND_URL, 'http://localhost:3500', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ── Body Parsing ──
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ── Static Files (uploads) ──
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// ── Health Check ──
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'alfatich-api' });
});
// ── API Routes ──
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/admin/stats', adminStats_1.default);
app.use('/api/profil', profil_1.default);
app.use('/api/lembaga', lembaga_1.default);
app.use('/api/agenda', agenda_1.default);
app.use('/api/maklumat', maklumat_1.default);
app.use('/api/galeri', galeri_1.default);
app.use('/api/artikel', artikel_1.default);
app.use('/api/forum', forum_1.default);
app.use('/api/psmb', psmb_1.default);
app.use('/api/stats', stats_1.default);
// ── 404 Handler ──
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});
// ── Error Handler ──
app.use(errorHandler_1.errorHandler);
// ── Start Server ──
app.listen(PORT, () => {
    console.log(`✅ Al-Fatich API server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map