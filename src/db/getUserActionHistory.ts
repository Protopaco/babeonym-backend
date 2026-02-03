import { pool } from '../utils/dbController.js';
import { logger } from '../utils/logger.js';
import UserActionHistory from '../models/UserActionHistory.js';
import NameState from '../models/NameState.js';

export default async (userId: number): Promise<UserActionHistory[]> => {
    logger.debug(`Fetching action history for user ID: ${userId}`);
    try {
        const { rows } = await pool.query('SELECT * FROM user_action_history($1)', [userId]);
        logger.debug(rows)
        if (Array.isArray(rows) && rows.length === 0) {
            logger.info(`No action history found for user ID: ${userId}`);
            return [];
        }

        const history: UserActionHistory[] = rows.map(row => {

            const newState = NameState[row.out_state.toUpperCase() as keyof typeof NameState];
            if (!newState) {
                throw new Error(`Invalid name state value: ${row.out_state}`);
            }
            logger.debug(`Mapped state: ${row.out_state} to ${newState}`);
            return {
                givenName: row.out_given_name,
                state: newState,
                dateUpdated: row.out_date_updated,
                givenCustomNameBridgeId: row.out_given_custom_name_bridge_id
            }
        });
        logger.info(`Retrieved action history for user ID: ${userId}`);
        logger.debug(history);
        return history;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}   