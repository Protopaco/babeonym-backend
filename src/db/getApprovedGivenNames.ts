import { pool } from '../utils/dbController';
import { GivenName } from '../models/GivenName'
import { logger } from '../utils/logger';

export default async (userId: number): Promise<GivenName[]> => {

    logger.info(`Fetching approved given names for user ID: ${userId}`);
    try {
        const { rows } = await pool.query('SELECT * FROM get_approved_given_names($1)', [userId]);
        logger.debug(rows);
        const givenNames: GivenName[] = rows.map((row) => ({
            id: row.out_id,
            givenName: row.out_given_name,
            givenCustomNameBridgeId: row.out_given_custom_name_bridge_id,
        }));

        return givenNames;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}