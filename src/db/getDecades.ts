import { pool } from "../utils/dbController";
import Decade from "../models/Decade";
import { logger } from "../utils/logger";

export default async (): Promise<Decade[]> => {
  logger.info("Fetching decades from database");
  const { rows } = await pool.query(`SELECT * FROM get_reference_decades();`);
  logger.debug(rows);
  const returnDecades: Decade[] = rows.map((row) => ({
    id: row.out_id,
    decade: row.out_decade,
    label: row.out_label,
  }));
  return returnDecades;
};
