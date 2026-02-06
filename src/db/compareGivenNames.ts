import { pool } from "../utils/dbController";
import UserSettings from "../models/UserSettings";
import { logger } from "../utils/logger";

export default async (
  userId: number,
  winnerId: number,
  loserId: number,
): Promise<void> => {
  logger.info(
    `Updating given name comparison for user ID: ${userId} with winner ID: ${winnerId} and loser ID: ${loserId}`,
  );
  try {
    await pool.query("SELECT compare_given_names($1, $2, $3)", [
      userId,
      winnerId,
      loserId,
    ]);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
