import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";

export default async (userId: number) => {
  try {
    logger.info(`Deleting user with ID: ${userId}`);
    const { rows } = await pool.query("SELECT * FROM delete_user($1)", [
      userId,
    ]);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
