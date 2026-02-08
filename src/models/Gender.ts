const Gender = {
  MALE: "male",
  FEMALE: "female",
  NEUTRAL: "neutral",
};

export type GenderType = (typeof Gender)[keyof typeof Gender];

const parseGender = (value: unknown): GenderType | null => {
  if (
    typeof value === "string" &&
    Object.values(Gender).includes(value as any)
  ) {
    return value as GenderType;
  }
  return null;
};

export { parseGender };
export default Gender;
