const AUTH_PROVIDER = {
  GOOGLE: "google",
  MICROSOFT: "microsoft",
  ANONYMOUS: "anonymous",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

export const parseAuthProvider = (value: unknown): AuthProvider | null => {
  if (
    typeof value === "string" &&
    Object.values(AUTH_PROVIDER).includes(value as AuthProvider)
  ) {
    return value as AuthProvider;
  }
  return null;
};

export default AUTH_PROVIDER;
