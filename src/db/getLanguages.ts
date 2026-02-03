import { pool } from '../utils/dbController.js';
import { logger } from '../utils/logger.js';
import Language from '../models/Language.js';

export default async (): Promise<Language[]> => {
    logger.info("Fetching languages from database");
    const { rows } = await pool.query(`SELECT * FROM get_reference_languages();`);
    logger.debug(rows);
    const returnLanguages: Language[] = rows.map(row => ({
        id: row.out_id,
        name: row.out_name
    }));
    return returnLanguages;
}   
