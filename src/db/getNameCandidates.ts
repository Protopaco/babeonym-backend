import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";
import GivenName from "../models/GivenName";

export default async (
  userId: number,
  genderIds: number[] | null,
  decadeIds: number[] | null,
  languageIds: number[] | null,
  cultureIds: number[] | null,
  limit: number | null,
  excludeBridgeIds: number[] | null = null,
): Promise<GivenName[]> => {
  logger.info(`Fetching name candidates for user ID: ${userId}`);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM get_name_candidates($1, $2, $3, $4, $5, $6, $7);",
      [
        userId,
        genderIds,
        decadeIds,
        languageIds,
        cultureIds,
        limit,
        excludeBridgeIds,
      ],
    );
    return rows.map((row) => ({
      givenName: row.out_given_name,
      givenCustomNameBridgeId: row.out_given_custom_name_bridge_id,
      etymology: row.out_etymology,
    }));
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
