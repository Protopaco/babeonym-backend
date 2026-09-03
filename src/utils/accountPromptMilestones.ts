import { logger } from "./logger";

const DEFAULT_MILESTONES = [25, 50, 75];

const parseMilestones = (value?: string): number[] => {
  if (!value) {
    return DEFAULT_MILESTONES;
  }

  const parsed = value
    .split(",")
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isInteger(entry) && entry > 0);

  if (parsed.length === 0) {
    logger.warn(
      `ACCOUNT_PROMPT_MILESTONES was set to "${value}" but contained no positive integers. Falling back to defaults.`,
    );
    return DEFAULT_MILESTONES;
  }

  return parsed;
};

const accountPromptMilestones = parseMilestones(
  process.env.ACCOUNT_PROMPT_MILESTONES,
);

export default accountPromptMilestones;
