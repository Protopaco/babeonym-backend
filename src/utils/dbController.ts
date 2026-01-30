import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};
console.log("🚀 ~ config:", config)

export const pool = new Pool(config as pkg.PoolConfig);
console.log("🚀 ~ config:", config)

export async function closePool() {
  await pool.end();
}
