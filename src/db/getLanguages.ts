import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";
import Language from "../models/Language";

export default async (): Promise<Language[]> => {
  logger.info("Fetching languages from database");
  const { rows } = await pool.query(`SELECT * FROM get_reference_languages();`);
  logger.debug(rows);
  const returnLanguages: Language[] = rows.map((row) => ({
    id: row.out_id,
    label: row.out_label,
  }));
  return returnLanguages;
};
