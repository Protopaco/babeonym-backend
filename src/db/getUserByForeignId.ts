import { pool } from "../utils/dbController";
import User from "../models/User";
import { AuthProvider } from "../models/AuthProvider";
import { logger } from "../utils/logger";

export default async (
  foreignId: string,
  authProvider: AuthProvider,
): Promise<User | null> => {
  logger.info(
    `Fetching user by foreign ID: ${foreignId} and auth provider: ${authProvider}`,
  );
  try {
    const { rows } = await pool.query(
      "SELECT * FROM get_user_by_foreign_id($1, $2)",
      [foreignId, authProvider],
    );
    if (Array.isArray(rows) && rows.length > 0) {
      logger.info(
        `User found with foreign ID: ${foreignId} and auth provider: ${authProvider}`,
      );
      const returnedUser = {
        id: rows[0].out_id,
        email: rows[0].out_email,
        username: rows[0].out_user_name,
        authProvider: rows[0].out_auth_provider,
        theme: rows[0].out_theme,
        surName: rows[0].out_sur_name,
      };
      logger.debug(returnedUser);
      return returnedUser;
    } else {
      logger.info(
        `No user found with foreign ID: ${foreignId} and auth provider: ${authProvider}`,
      );
      return null;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
