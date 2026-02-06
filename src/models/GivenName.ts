import Genders from "./Genders";

export default interface GivenName {
  givenName: string;
  givenCustomNameBridgeId: number;
  rating: number;
  percentile?: number;
  gender?: keyof typeof Genders;
}
