const Theme = {
  LIGHT: "light",
  DARK: "dark",
  BLUE: "blue",
  PINK: "pink",
};

export type Theme = (typeof Theme)[keyof typeof Theme];

const parseTheme = (value: unknown): Theme | null => {
  if (
    typeof value === "string" &&
    Object.values(Theme).includes(value as any)
  ) {
    return value as Theme;
  }
  return null;
};

export { parseTheme };
export default Theme;
