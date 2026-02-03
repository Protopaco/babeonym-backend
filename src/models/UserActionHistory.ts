import NameState from './NameState.js';

export default interface UserActionHistory {
    givenName: string;
    state: keyof typeof NameState;
    dateUpdated: Date;
    givenCustomNameBridgeId: number;
}
