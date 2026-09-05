import { logger } from "../utils/logger";
import { pool } from "../utils/dbController";

export default async (userId: number, bridgeIds: number[]): Promise<void> => {
  logger.debug(
    `Setting given name order for user ${userId}: ${bridgeIds.join(", ")}`,
  );
  await pool.query(`SELECT set_given_name_order($1, $2);`, [userId, bridgeIds]);
  logger.info(
    `Given name order set for user ${userId} across ${bridgeIds.length} names`,
  );
};
