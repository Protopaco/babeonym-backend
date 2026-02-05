import { pool } from "../utils/dbController.js";
import { logger } from "../utils/logger.js";
import NameState from "../models/NameState.js";

export default async (
  userId: number,
  givenCustomNameBridgeId: number,
  newState: typeof NameState,
): Promise<void> => {
  logger.debug(
    `Updating given name action for user ID: ${userId} with custom name bridge ID: ${givenCustomNameBridgeId} to state: ${newState}`,
  );

  try {
    await pool.query("SELECT * FROM given_name_action($1, $2, $3)", [
      userId,
      givenCustomNameBridgeId,
      newState,
    ]);
    logger.info(
      `Successfully updated given name action for user ID: ${userId}`,
    );
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
