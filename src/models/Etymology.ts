export interface EtymologyLanguage {
  id: number;
  label: string;
  flag: string;
}

export interface EtymologyCulture {
  id: number;
  label: string;
}

export interface EtymologyMeaning {
  id: number;
  text: string;
  language: EtymologyLanguage | null;
}

export default interface Etymology {
  meanings: EtymologyMeaning[];
  languages: EtymologyLanguage[];
  cultures: EtymologyCulture[];
}
