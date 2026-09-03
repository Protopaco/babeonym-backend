import { pool } from "../utils/dbController";
import { logger } from "../utils/logger";
import FilterOption from "../models/FilterOption";
import NameFilters from "../models/NameFilters";

const FILTER_TYPE_KEYS: Record<string, keyof NameFilters> = {
  gender: "genderOptions",
  decade: "decadeOptions",
  culture: "cultureOptions",
  language: "languageOptions",
};

export default async (): Promise<NameFilters> => {
  logger.info("Fetching name filters from database");
  const { rows } = await pool.query("SELECT * FROM get_name_filters();");

  const nameFilters: NameFilters = {
    genderOptions: [],
    decadeOptions: [],
    cultureOptions: [],
    languageOptions: [],
  };

  // The function returns one flat, already ordered list. Splitting it here
  // keeps each group in the order the query chose.
  rows.forEach((row) => {
    const key = FILTER_TYPE_KEYS[row.out_filter_type];
    if (!key) return;

    const option: FilterOption = {
      id: row.out_id,
      label: row.out_label,
      searchText: row.out_search_text,
    };

    nameFilters[key].push(option);
  });

  return nameFilters;
};
