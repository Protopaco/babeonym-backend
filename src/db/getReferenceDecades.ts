import { pool } from '../utils/dbController.js';
import { Decade } from '../models/Decade.js';
import { logger } from '../utils/logger.js';

export default async (): Promise<Decade[]> => {
    logger.info("Fetching reference decades from database");
    const { rows } = await pool.query<Decade>(`SELECT * FROM get_reference_decades();`);

    return rows;
}

