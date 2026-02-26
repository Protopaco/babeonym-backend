import actionSchemas from "./action";
import authSchemas from "./auth";
import compareSchemas from "./compare";
import cultureSchemas from "./cultures";
import customSchemas from "./custom";
import decadeSchemas from "./decade";
import errorSchemas from "./errorSchemas";
import etymologySchemas from "./etymology";
import givenNameSchemas from "./givenName";
import healthSchemas from "./health";
import languageSchemas from "./language";
import notAuthenticatedSchemas from "./notAuthenticated";
import settingsSchemas from "./settings";
import successSchemas from "./success";
import userSchemas from "./user";
import userActionHistorySchemas from "./userActionHistory";
import userSettingsSchemas from "./userSettings";

const schemas = {
  ...actionSchemas,
  ...authSchemas,
  ...compareSchemas,
  ...cultureSchemas,
  ...customSchemas,
  ...decadeSchemas,
  ...errorSchemas,
  ...etymologySchemas,
  ...givenNameSchemas,
  ...healthSchemas,
  ...languageSchemas,
  ...notAuthenticatedSchemas,
  ...settingsSchemas,
  ...successSchemas,
  ...userSchemas,
  ...userActionHistorySchemas,
  ...userSettingsSchemas,
} as const;

export default schemas;
