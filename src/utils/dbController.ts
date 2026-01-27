import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const config = process.env.DB_URL
  ? { connectionString: process.env.DB_URL }
  : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };

export const pool = new Pool(config as pkg.PoolConfig);

export async function closePool() {
  await pool.end();
}
