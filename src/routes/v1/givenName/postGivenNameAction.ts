import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import { NameState, parseNameState } from "../../../models/NameState";
import updateGivenNameAction from "../../../db/updateGivenNameAction";
import getApprovedGivenNames from "../../../db/getApprovedGivenNames";
import shouldPromptAccountCreation from "../../../utils/shouldPromptAccountCreation";
import User from "../../../models/User";
import approvedGivenNameLimit from "../../../utils/approvedGivenNameLimit";

/**
 * @swagger
 * /api/v1/givenName/action:
 *   post:
 *     operationId: v1GivenNameAction
 *     summary: Update given name state
 *     description: Updates the state of a given name (approved, rejected, or snoozed) for the authenticated user.
 *     tags:
 *       - GivenName
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/V1GivenNameActionRequest'
 *     responses:
 *       200:
 *         description: The user's approved given names after the action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GivenNameMutationResponse'
 *       400:
 *         description: Invalid request parameters, or the account already holds the maximum number of approved given names
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 */

router.post(
  "/action",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const userId = user.id;
    logger.info(`POST given name action by user ID: ${userId}`);

    const body = req.body.v1GivenNameActionRequest ?? req.body;

    const givenCustomNameBridgeId = Number(body.givenCustomNameBridgeId);
    const newState = parseNameState(body.newState);

    if (!Number.isInteger(givenCustomNameBridgeId)) {
      return res
        .status(400)
        .json({ message: "Invalid givenCustomNameBridgeId" });
    }

    if (!newState) {
      return res.status(400).json({ message: "Invalid newState" });
    }

    // Only approvals are capped. Rejecting and snoozing cannot grow the list,
    // and this is the endpoint every swipe in the generator hits, so making the
    // common path pay for an extra query would be the wrong trade.
    //
    // Rejections are bounded anyway: given_name_action upserts on
    // (user_id, given_custom_name_bridge_id), so a name is one row however many
    // times it is swiped, and the ceiling is the size of the name corpus.
    //
    // Re-approving a name that is already approved is refused at the limit even
    // though it would not add a row. Distinguishing that case costs another
    // query to save a no-op, which is not worth it.
    if (newState === NameState.APPROVED) {
      const approvedGivenNameCount = (await getApprovedGivenNames(userId))
        .length;
      if (approvedGivenNameCount >= approvedGivenNameLimit) {
        return res.status(400).json({
          message: `Account already holds the maximum of ${approvedGivenNameLimit} approved given names`,
        });
      }
    }

    await updateGivenNameAction(userId, givenCustomNameBridgeId, newState);

    const approvedGivenNames = await getApprovedGivenNames(userId);
    const promptAccountCreation = await shouldPromptAccountCreation(user);
    return res
      .status(200)
      .json({ approvedGivenNames, user: { promptAccountCreation } });
  },
);

export default router;
