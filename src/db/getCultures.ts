import { pool } from '../utils/dbController.js';
import { Culture } from '../models/Culture.js';
import { logger } from '../utils/logger.js';

export default async (): Promise<Culture[]> => {
    logger.info("Fetching cultures from database");
    const { rows } = await pool.query(`SELECT * FROM get_reference_cultures();`);
    logger.debug(rows);
    const returnCultures: Culture[] = rows.map(row => ({
        id: row.out_id,
        name: row.out_name
    }));
    return returnCultures;
}