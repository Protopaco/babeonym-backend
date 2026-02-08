import { pool } from "../utils/dbController";
import Culture from "../models/Culture";
import { logger } from "../utils/logger";

export default async (): Promise<Culture[]> => {
  logger.info("Fetching cultures from database");
  const { rows } = await pool.query(`SELECT * FROM get_reference_cultures();`);
  logger.debug(rows);
  const returnCultures: Culture[] = rows.map((row) => ({
    id: row.out_id,
    label: row.out_label,
  }));
  return returnCultures;
};
