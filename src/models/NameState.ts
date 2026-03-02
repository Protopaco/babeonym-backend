export const NameState = {
  APPROVED: "approved",
  REJECTED: "rejected",
  SNOOZED: "snoozed",
} as const;

export type NameState = (typeof NameState)[keyof typeof NameState];

export const parseNameState = (value: unknown): NameState | null => {
  if (typeof value !== "string") return null;

  const normalized = value.toLowerCase();
  const allowed = Object.values(NameState);

  if (allowed.includes(normalized as NameState)) {
    return normalized as NameState; // returns canonical "approved"|"rejected"|"snoozed"
  }

  return null;
};
