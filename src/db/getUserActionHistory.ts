import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";
import UserActionHistory from "../models/UserActionHistory";
import NameState from "../models/NameState";

export default async (userId: number): Promise<UserActionHistory[]> => {
  logger.debug(`Fetching action history for user ID: ${userId}`);
  try {
    const { rows } = await pool.query("SELECT * FROM user_action_history($1)", [
      userId,
    ]);
    logger.debug(rows);
    if (Array.isArray(rows) && rows.length === 0) {
      logger.info(`No action history found for user ID: ${userId}`);
      return [];
    }

    const history: UserActionHistory[] = rows.map((row) => {
      return {
        givenName: row.out_given_name,
        state: row.out_state as keyof typeof NameState,
        dateUpdated: row.out_date_updated,
        givenCustomNameBridgeId: row.out_given_custom_name_bridge_id,
      };
    });
    logger.info(`Retrieved action history for user ID: ${userId}`);
    logger.debug(history);
    return history;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
