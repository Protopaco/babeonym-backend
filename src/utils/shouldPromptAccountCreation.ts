import AUTH_PROVIDER from "../models/AuthProvider";
import User from "../models/User";
import getUserActionCount from "../db/getUserActionCount";
import accountPromptMilestones from "./accountPromptMilestones";
import { logger } from "./logger";

/**
 * Whether the user has just reached a point where offering to preserve their
 * work is worthwhile.
 *
 * Milestones are matched exactly rather than as thresholds. Every action moves
 * the count by one or zero, so the count steps through every integer and each
 * milestone is hit on exactly one response. That is what removes the need to
 * record which milestones have already been shown.
 */
export default async (user: User): Promise<boolean> => {
  if (user.authProvider !== AUTH_PROVIDER.ANONYMOUS) {
    return false;
  }

  try {
    const actionCount = await getUserActionCount(user.id);
    return accountPromptMilestones.includes(actionCount);
  } catch (error) {
    // The action itself already succeeded. A failed prompt check should not
    // fail the response; missing a prompt is preferable to losing the action.
    logger.error(
      error,
      `Could not determine account prompt state for user ${user.id}`,
    );
    return false;
  }
};
