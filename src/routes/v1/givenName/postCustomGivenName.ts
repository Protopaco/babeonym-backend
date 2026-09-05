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
 *         description: Invalid or inappropriate custom given name
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

    await addCustomGivenName(userId, normalizedGivenName);

    const approvedGivenNames = await getApprovedGivenNames(userId);
    const promptAccountCreation = await shouldPromptAccountCreation(user);
    res
      .status(200)
      .json({ approvedGivenNames, user: { promptAccountCreation } });
  },
);

export default router;
