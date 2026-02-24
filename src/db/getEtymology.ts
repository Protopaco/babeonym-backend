import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";
import Etymology from "../models/Etymology";

export default async (givenCustomNameBridgeId: Number): Promise<Etymology> => {
  logger.info(`Fetching Etymology for given name ${givenCustomNameBridgeId}`);
  const { rows } = await pool.query(`SELECT * FROM get_etymology($1)`, [
    givenCustomNameBridgeId,
  ]);
  logger.debug(rows[0]);
  return rows[0];
};
