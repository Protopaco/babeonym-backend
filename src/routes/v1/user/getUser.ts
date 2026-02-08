import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import User from "../../../models/User";
/**
 * @swagger
 * /api/v1/user/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the currently authenticated user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [user]
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.get("/me", ensureAuthenticated, async (req: Request, res: Response) => {
  const userId = (req.user as User).id;
  logger.info(`Fetching user information for user ID: ${userId}`);
  res.status(200).send({ user: req.user });
});

export default router;
