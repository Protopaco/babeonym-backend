const NameState = {
  APPROVED: "approved",
  REJECTED: "rejected",
  SNOOZED: "snoozed",
};

export type NameState = (typeof NameState)[keyof typeof NameState];

const parseNameState = (value: unknown): NameState | null => {
  if (
    typeof value === "string" &&
    Object.values(NameState).includes(value as any)
  ) {
    return value as NameState;
  }
  return null;
};

export { parseNameState };

export default NameState;
