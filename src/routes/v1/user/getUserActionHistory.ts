import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import getUserActionHistory from "../../../db/getUserActionHistory.js";
import User from "../../../models/User";
import UserActionHistory from "../../../models/UserActionHistory.js";

/**
 * @swagger
 * /api/v1/user/actionHistory:
 *   get:
 *     operationId: v1UserActionHistory
 *     summary: Get user action history
 *     description: Returns the authenticated user's given-name action history.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User action history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [actionHistory]
 *               properties:
 *                 actionHistory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserActionHistory'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 *       404:
 *         description: User not found in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */

router.get(
  "/actionHistory",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(`Fetching action history for user ID: ${userId}`);
    if (!req.user) {
      logger.warn("User not found in request object");
      return res.status(404).json({ error: "User not found" });
    }
    const actionHistory: UserActionHistory[] =
      await getUserActionHistory(userId);
    res.status(200).json({ actionHistory });
  },
);

export default router;
