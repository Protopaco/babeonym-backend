import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import NameState from "../../../models/NameState";
import updateGivenNameAction from "../../../db/updateGivenNameAction";
import User from "../../../models/User";

/**
 * @swagger
 * /givenName/action:
 *   post:
 *     summary: Update given name state
 *     description: Updates the state of a given name (approved, rejected, or snoozed) for the authenticated user.
 *     tags:
 *       - GivenName
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [givenCustomNameBridgeId, newState]
 *             properties:
 *               givenCustomNameBridgeId:
 *                 type: number
 *                 example: 123
 *               newState:
 *                 type: string
 *                 enum: [APPROVED, REJECTED, SNOOZED]
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: Given name action updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Given name action updated successfully
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request parameters
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
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
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    await updateGivenNameAction(userId, givenCustomNameBridgeId, newState);
    res.status(200).json({ message: "Given name action updated successfully" });
  },
);

export default router;
