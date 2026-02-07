import { pool } from "../utils/dbController";
import GivenName from "../models/GivenName";
import { logger } from "../utils/logger";

export default async (
  userId: number,
  searchText: string,
  limit: number,
): Promise<GivenName[]> => {
  logger.info(
    `Searching given names for user ID: ${userId} with search text: "${searchText}"`,
  );
  try {
    const { rows } = await pool.query(
      "SELECT * FROM given_names_search($1, $2, $3)",
      [userId, searchText, limit],
    );
    logger.debug(rows);
    const givenNames: GivenName[] = rows.map((row) => ({
      givenName: row.out_given_name,
      givenCustomNameBridgeId: row.out_given_custom_name_bridge_id,
      rating: row.out_rating,
    }));

    return givenNames;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
