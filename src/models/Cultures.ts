type Cultures = {
  id: number;
  label: string;
  regions: {
    id: number;
    label: string;
    cultures: {
      id: number;
      label: string;
    }[];
  }[];
}[];

export default Cultures;
