const Theme = {
  LIGHT: "light",
  DARK: "dark",
  BLUE: "blue",
  PINK: "pink",
};

export type ThemeType = (typeof Theme)[keyof typeof Theme];

const parseTheme = (value: unknown): ThemeType | null => {
  if (
    typeof value === "string" &&
    Object.values(Theme).includes(value as any)
  ) {
    return value as ThemeType;
  }
  return null;
};

export { parseTheme };
export default Theme;
