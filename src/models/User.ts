import AuthProvider from "./AuthProvider.js";

export default interface User {
  id: number;
  email?: string;
  username?: string;
  authProvider?: typeof AuthProvider;
  theme?: string;
  surName?: string;
}
