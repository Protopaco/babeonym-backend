import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";

export default async (userId: number, theme: string): Promise<void> => {
  logger.info(`Updating theme for user ID: ${userId} to: ${theme}`);
  try {
    await pool.query("SELECT * FROM update_user_theme($1, $2)", [
      userId,
      theme,
    ]);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
