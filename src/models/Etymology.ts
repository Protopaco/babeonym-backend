export interface EtymologyLanguage {
  id: number;
  label: string;
  flag: string | null;
}

export interface EtymologyCulture {
  id: number;
  label: string;
}

export interface EtymologyMeaning {
  short: string | null;
  long: string | null;
  dateCreated: string | null; // ISO timestamp from Postgres
  dateUpdated: string | null; // ISO timestamp from Postgres
}

export default interface Etymology {
  givenCustomNameBridgeId: number;
  givenName: string;
  languages: EtymologyLanguage[];
  cultures: EtymologyCulture[];
  meaning: EtymologyMeaning;
}
