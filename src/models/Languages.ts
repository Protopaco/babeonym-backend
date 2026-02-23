export type Languages = {
  id: number;
  label: string;
  regions: {
    id: number;
    label: string;
    languages: {
      id: number;
      label: string;
      flag: string | null;
    }[];
  }[];
}[];

export default Languages;
