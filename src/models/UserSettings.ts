import { ThemeType } from "./Theme";

export default interface UserSettings {
  userId: number;
  theme: ThemeType;
  surName: string;
}
