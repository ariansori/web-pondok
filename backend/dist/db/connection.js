"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'alfatich',
    password: process.env.DB_PASSWORD || 'alfatich123',
    database: process.env.DB_NAME || 'alfatich_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});
// Test connection on startup
pool.getConnection()
    .then(conn => {
    console.log('✅ MySQL connected to', process.env.DB_NAME || 'alfatich_db');
    conn.release();
})
    .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('   Make sure MySQL is running and credentials are correct in .env');
});
exports.default = pool;
//# sourceMappingURL=connection.js.map