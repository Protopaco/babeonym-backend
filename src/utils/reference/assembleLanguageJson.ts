import Languages from "../../models/Languages";

type Row = {
  out_continent_id: number;
  out_continent_label: string;
  out_region_id: number;
  out_region_label: string;
  out_language_id: number | null;
  out_language_label: string | null;
  out_language_flag: string | null;
};

export default (rows: Row[]): Languages => {
  const continents = new Map<number, Languages[number]>();

  rows.forEach((row) => {
    // Continent
    if (!continents.has(row.out_continent_id)) {
      continents.set(row.out_continent_id, {
        id: row.out_continent_id,
        label: row.out_continent_label,
        regions: [],
      });
    }

    const continent = continents.get(row.out_continent_id)!;

    // Region
    let region = continent.regions.find((r) => r.id === row.out_region_id);

    if (!region) {
      region = {
        id: row.out_region_id,
        label: row.out_region_label,
        languages: [],
      };
      continent.regions.push(region);
    }

    // Language (may be null if region has none)
    if (row.out_language_id) {
      region.languages.push({
        id: row.out_language_id,
        label: row.out_language_label!,
        flag: row.out_language_flag,
      });
    }
  });

  return Array.from(continents.values());
};
