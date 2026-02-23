import Cultures from "../../models/Cultures";

type CultureRow = {
  out_continent_id: number;
  out_continent_label: string;
  out_region_id: number;
  out_region_label: string;
  out_culture_id: number | null;
  out_culture_label: string | null;
};

export default (rows: CultureRow[]): Cultures => {
  const continents = new Map<number, Cultures[number]>();

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
        cultures: [],
      };
      continent.regions.push(region);
    }

    // Culture (may be null if region has none)
    if (row.out_culture_id) {
      region.cultures.push({
        id: row.out_culture_id,
        label: row.out_culture_label!,
      });
    }
  });

  return Array.from(continents.values());
};
