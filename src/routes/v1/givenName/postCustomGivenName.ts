import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import addCustomGivenName from "../../../db/addCustomGivenName";
import getApprovedGivenNames from "../../../db/getApprovedGivenNames";
import shouldPromptAccountCreation from "../../../utils/shouldPromptAccountCreation.js";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User.js";
import isBadWord from "../../../utils/isBadWord.js";
import normalizeCustomGivenName from "../../../utils/normalizeCustomGivenName.js";
import approvedGivenNameLimit from "../../../utils/approvedGivenNameLimit.js";

/**
 * @swagger
 * /api/v1/givenName/custom:
 *   post:
 *     operationId: v1GivenNameCustom
 *     summary: Add a custom given name
 *     description: Adds a user-defined custom given name for the authenticated user.
 *     tags:
 *       - GivenName
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/V1GivenNameCustomRequest'
 *     responses:
 *       200:
 *         description: The user's approved given names after the custom name is added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GivenNameMutationResponse'
 *       400:
 *         description: Invalid or inappropriate custom given name, or the account already holds the maximum number of approved given names
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 */

router.post(
  "/custom",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const userId = user.id;
    logger.info("Custom given name request by user ID: " + userId);

    const { customGivenName } = req.body;
    if (typeof customGivenName !== "string") {
      return res.status(400).json({ error: "Invalid custom given name" });
    }

    // Normalized before it is checked as well as before it is stored, so a name
    // that is only whitespace is rejected rather than saved as blank, and so the
    // value the profanity filter sees is the value that gets persisted.
    const normalizedGivenName = normalizeCustomGivenName(customGivenName);
    if (!normalizedGivenName) {
      return res.status(400).json({ error: "Invalid custom given name" });
    }

    if (isBadWord(normalizedGivenName)) {
      return res
        .status(400)
        .json({ error: "customGivenName contains inappropriate language" });
    }

    // Counted from the list rather than with a dedicated count query, so this
    // needs no new database function. The list is never paginated and a capped
    // account holds a hundred rows, so fetching it is cheaper than the round
    // trip saved by counting.
    //
    // Read before the write and outside any transaction, so two requests
    // arriving together can both pass. Deliberate: see approvedGivenNameLimit.
    const currentApprovedGivenNames = await getApprovedGivenNames(userId);

    // A name already on the list is accepted without a write. The client refuses
    // these itself, so this only catches a request that skipped it. Checked
    // ahead of the limit so a full list does not refuse a name it already holds,
    // and case-insensitively to match add_custom_given_name's canonical lookup.
    const lowercaseGivenName = normalizedGivenName.toLowerCase();
    const isAlreadyApproved = currentApprovedGivenNames.some(
      (approvedGivenName) =>
        approvedGivenName.givenName.toLowerCase() === lowercaseGivenName,
    );
    if (isAlreadyApproved) {
      logger.info(
        "Custom given name already approved, skipping write for user ID: " +
          userId,
      );
      const promptAccountCreation = await shouldPromptAccountCreation(user);
      return res.status(200).json({
        approvedGivenNames: currentApprovedGivenNames,
        user: { promptAccountCreation },
      });
    }

    if (currentApprovedGivenNames.length >= approvedGivenNameLimit) {
      return res.status(400).json({
        error: `Account already holds the maximum of ${approvedGivenNameLimit} approved given names`,
      });
    }

    await addCustomGivenName(userId, normalizedGivenName);

    const approvedGivenNames = await getApprovedGivenNames(userId);
    const promptAccountCreation = await shouldPromptAccountCreation(user);
    res
      .status(200)
      .json({ approvedGivenNames, user: { promptAccountCreation } });
  },
);

export default router;
