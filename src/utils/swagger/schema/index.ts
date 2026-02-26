import actionSchemas from "./action";
import authSchemas from "./auth";
import compareSchemas from "./compare";
import cultureSchemas from "./cultures";
import customSchemas from "./custom";
import decadeSchemas from "./decade";
import errorSchemas from "./error";
import etymologySchemas from "./etymology";
import givenNameSchemas from "./givenName";
import languageSchemas from "./language";
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
  ...languageSchemas,
  ...userSchemas,
  ...userActionHistorySchemas,
  ...userSettingsSchemas,
} as const;

export default schemas;
