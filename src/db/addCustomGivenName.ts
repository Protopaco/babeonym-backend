import { logger } from '../utils/logger';
import { pool } from '../utils/dbController';


export default async (userId: number, customGivenName: string): Promise<void> => {
    logger.debug(`Adding custom given name for user ${userId}: ${customGivenName}`);
    await pool.query(`SELECT add_custom_given_name($1, $2);`, [userId, customGivenName]);
    logger.info(`Custom given name added for user ${userId}: ${customGivenName}`);
}   
