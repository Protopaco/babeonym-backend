import { pool } from "../utils/dbController";
import Cultures from "../models/Cultures";
import { logger } from "../utils/logger";
import assembleCultureJson from "../utils/reference/assembleCultureJson";

export default async (): Promise<Cultures> => {
  logger.info("Fetching cultures from database");
  const { rows } = await pool.query(`SELECT * FROM get_reference_cultures();`);
  logger.debug(rows);
  const returnCultures = assembleCultureJson(rows);

  return returnCultures;
};
