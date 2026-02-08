import { GenderType } from "./Gender";

export default interface GivenName {
  givenName: string;
  givenCustomNameBridgeId: number;
  rating?: number;
  percentile?: number;
  gender?: GenderType;
}
