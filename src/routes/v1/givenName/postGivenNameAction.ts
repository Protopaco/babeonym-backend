import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import NameState from "../../../models/NameState";
import updateGivenNameAction from "../../../db/updateGivenNameAction";
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
 *         description: Given name action updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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

    const { givenCustomNameBridgeId, newState } = req.body;
    if (
      typeof givenCustomNameBridgeId !== "number" ||
      !newState ||
      (newState !== NameState.APPROVED &&
        newState !== NameState.REJECTED &&
        newState !== NameState.SNOOZED)
    ) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    await updateGivenNameAction(userId, givenCustomNameBridgeId, newState);
    res.status(200).json({ message: "Given name action updated successfully" });
  },
);

export default router;
