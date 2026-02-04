import { pool } from "../utils/dbController.js";
import { logger } from "../utils/logger.js";
import GivenName from "../models/GivenName.js";

export default async (
    userId: number,
    popularity: number | null,
    genders: string[] | null,
    decades: string[] | null,
    limit: number,
): Promise<GivenName[]> => {
    logger.info(`Fetching given names for user ID: ${userId}`);
    try {
        const { rows } = await pool.query(
            "SELECT * FROM get_given_names_by_user_id($1, $2, $3, $4, $5);",
            [userId, popularity, genders, decades, limit],
        );
        logger.debug(rows);
        return rows.map((row) => ({
            givenName: row.out_given_name,
            givenCustomNameBridgeId: row.out_given_custom_name_bridge_id,
        }));
    } catch (error) {
        logger.error(error);
        throw error;
    }
};
