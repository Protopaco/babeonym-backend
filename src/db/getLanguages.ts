import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";
import Languages from "../models/Languages";
import assembleLanguageJson from "../utils/reference/assembleLanguageJson";

export default async (): Promise<Languages> => {
  logger.info("Fetching languages from database");
  const { rows } = await pool.query(`SELECT * FROM get_reference_languages();`);

  const returnLanguages = assembleLanguageJson(rows);
  return returnLanguages;
};
