import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";

export default async (userId: number): Promise<number> => {
  logger.info(`Fetching action count for user ID: ${userId}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM get_user_action_count($1)",
      [userId],
    );
    logger.debug(rows);

    return rows[0]?.out_action_count ?? 0;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
