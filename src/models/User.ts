import { AuthProvider } from "./AuthProvider";

export default interface User {
  id: number;
  email?: string;
  username?: string;
  authProvider: AuthProvider;
  theme?: string;
  surName?: string;
}
