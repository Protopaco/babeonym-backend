import { pool } from "../utils/dbController";
import UserSettings from "../models/UserSettings";
import { logger } from "../utils/logger";

export default async (
  userId: number,
  surName: string | null,
): Promise<UserSettings> => {
  logger.info(
    `Updating user settings for user ID: ${userId} with surName: ${surName}`,
  );
  try {
    const { rows } = await pool.query(
      "SELECT * FROM update_user_settings($1, $2)",
      [userId, surName],
    );
    logger.debug(rows);
    const updatedSettings: UserSettings = {
      userId: rows[0].out_user_id,
      theme: rows[0].out_theme,
      surName: rows[0].out_sur_name,
    };

    return updatedSettings;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
