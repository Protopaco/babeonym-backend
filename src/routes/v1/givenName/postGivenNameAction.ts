import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import { NameState, parseNameState } from "../../../models/NameState";
import updateGivenNameAction from "../../../db/updateGivenNameAction";
import getApprovedGivenNames from "../../../db/getApprovedGivenNames";
import User from "../../../models/User";

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
 *               $ref: '#/components/schemas/ApprovedGivenNamesResponse'
 *       400:
 *         description: Invalid request parameters
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
    const userId = (req.user as User).id;
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

    await updateGivenNameAction(userId, givenCustomNameBridgeId, newState);

    const approvedGivenNames = await getApprovedGivenNames(userId);
    return res.status(200).json({ approvedGivenNames });
  },
);

export default router;
