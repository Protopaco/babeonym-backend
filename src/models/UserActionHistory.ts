import { NameState } from "./NameState";

export default interface UserActionHistory {
  givenName: string;
  state: keyof typeof NameState;
  dateUpdated: Date;
  givenCustomNameBridgeId: number;
}
