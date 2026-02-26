import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import User from "../../../models/User";
import resetUser from "../../../db/resetUser";

/**
 * @swagger
 * /api/v1/user/me/reset:
 *   post:
 *     operationId: v1UserReset
 *     summary: Reset user state
 *     description: Resets the authenticated user's data to an initial state.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 */

router.post(
  "/me/reset",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(`Resetting user with ID: ${userId}`);
    await resetUser(userId!);
    res.status(200).json({ message: "User reset successfully" });
  },
);

export default router;
