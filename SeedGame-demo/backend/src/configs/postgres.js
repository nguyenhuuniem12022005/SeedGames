import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Check the connection
pool.on('connect', () => {
    console.log('Kết nối thành công tới PostgreSQL Database!');
});

pool.on('error', (err) => {
    console.error('Lỗi kết nối tới PostgreSQL Database:', err);
});

export default pool;