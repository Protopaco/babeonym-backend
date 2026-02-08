import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";

export default async (userId: number) => {
  try {
    const { rows } = await pool.query("SELECT * FROM get_user($1)", [userId]);
    if (Array.isArray(rows) && rows.length > 0) {
      logger.info(`User found with ID: ${userId}`);
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
      logger.info(`No user found with ID: ${userId}`);
      return null;
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
