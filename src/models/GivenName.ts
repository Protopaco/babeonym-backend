import Genders from "./Genders";

export default interface GivenName {
    givenName: string;
    givenCustomNameBridgeId: number;
    percentile?: number;
    gender?: keyof typeof Genders;
}
