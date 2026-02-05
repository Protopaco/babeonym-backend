import Theme from "./Theme";

export default interface UserSettings {
  userId: number;
  theme: keyof typeof Theme;
  surName: string;
}
