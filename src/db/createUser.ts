import { logger } from "../utils/logger.js";
import { pool } from "../utils/dbController.js";
import User from "../models/User.js";
import AuthProvider from "../models/AuthProvider.js";

export default async (
  authProvider?: string,
  foreignId?: string,
  email?: string,
  username?: string,
): Promise<User> => {
  logger.info("Creating a new anonymous user");
  const { rows } = await pool.query(
    `SELECT * FROM create_user($1, $2, $3, $4);`,
    [foreignId, authProvider, email, username],
  );
  return {
    id: rows[0].out_id,
    email: rows[0].out_email,
    username: rows[0].out_user_name,
  };
};
