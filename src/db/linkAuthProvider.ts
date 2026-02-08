import { logger } from "../utils/logger.js";
import { pool } from "../utils/dbController.js";
import { AuthProvider } from "../models/AuthProvider.js";

export default async (
  userId: number,
  authProvider: AuthProvider,
  foreignId: string,
  email?: string,
  username?: string,
): Promise<void> => {
  logger.info(`Linking auth provider ${authProvider} to user ${userId}`);
  try {
    await pool.query(
      "INSERT INTO link_auth_provider(user_id, auth_provider, foreign_id, email, username) VALUES ($1, $2, $3, $4, $5);",
      [userId, authProvider, foreignId, email, username],
    );
  } catch (err) {
    logger.error(
      `Error linking auth provider ${authProvider} to user ${userId}: ${err}`,
    );
    throw err;
  }
};
