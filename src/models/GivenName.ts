import { GenderType } from "./Gender";
import Etymology from "./Etymology";

export default interface GivenName {
  givenName: string;
  givenCustomNameBridgeId: number;
  rating?: number;
  gender?: GenderType;
  etymology?: Etymology | null;
}
