import actionSchemas from "./action";
import authSchemas from "./auth";
import compareSchemas from "./compare";
import customSchemas from "./custom";
import errorSchemas from "./errorSchemas";
import etymologySchemas from "./etymology";
import givenNameSchemas from "./givenName";
import healthSchemas from "./health";
import nameFiltersSchemas from "./nameFilters";
import notAuthenticatedSchemas from "./notAuthenticated";
import settingsSchemas from "./settings";
import successSchemas from "./success";
import themeSchemas from "./theme";
import userSchemas from "./user";
import userActionHistorySchemas from "./userActionHistory";
import userSettingsSchemas from "./userSettings";

const schemas = {
  ...actionSchemas,
  ...authSchemas,
  ...compareSchemas,
  ...customSchemas,
  ...errorSchemas,
  ...etymologySchemas,
  ...givenNameSchemas,
  ...healthSchemas,
  ...nameFiltersSchemas,
  ...notAuthenticatedSchemas,
  ...settingsSchemas,
  ...successSchemas,
  ...themeSchemas,
  ...userSchemas,
  ...userActionHistorySchemas,
  ...userSettingsSchemas,
} as const;

export default schemas;
