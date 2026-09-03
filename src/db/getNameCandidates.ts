import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";
import GivenName from "../models/GivenName";
import Genders, { GenderType } from "../models/Gender";

export default async (
  userId: number,
  popularity: number | null,
  genders: GenderType[] | null,
  decadeIds: number[] | null,
  languageIds: number[] | null,
  cultureIds: number[] | null,
  limit: number | null,
  includeMeta = false,
  excludeBridgeIds: number[] | null = null,
): Promise<GivenName[]> => {
  logger.info(`Fetching name candidates for user ID: ${userId}`);
  try {
    if (includeMeta) {
      logger.info(`Including meta information for user ID: ${userId}`);

      const { rows } = await pool.query(
        "SELECT * FROM get_name_candidates_meta($1, $2, $3, $4, $5, $6, $7);",
        [
          userId,
          popularity,
          genders,
          decadeIds,
          languageIds,
          cultureIds,
          limit,
        ],
      );
      return rows.map((row) => ({
        givenName: row.out_given_name,
        givenCustomNameBridgeId: row.out_given_custom_name_bridge_id,
        percentile: row.out_percentile,
        gender: row.out_gender,
      }));
    } else {
      const { rows } = await pool.query(
        "SELECT * FROM get_name_candidates($1, $2, $3, $4, $5, $6, $7, $8);",
        [
          userId,
          popularity,
          genders,
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
      }));
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
