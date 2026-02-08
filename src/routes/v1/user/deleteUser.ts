import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import deleteUser from "../../../db/deleteUser";
import User from "../../../models/User";

/**
 * @swagger
 * /api/v1/user/me:
 *   delete:
 *     summary: Delete current user
 *     description: Deletes the authenticated user account, logs them out, and destroys the session.
 *     tags:
 *       - User
 *     responses:
 *       204:
 *         description: User deleted and session terminated
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 *       500:
 *         description: Logout failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout failed
 */

router.delete(
  "/me",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(`Deleting user with ID: ${userId}`);
    await deleteUser(userId!);

    req.logout(function (err) {
      if (err) {
        logger.error(err);
        return res.status(500).json({ message: "Logout failed" });
      }
      req.session?.destroy(() => {
        logger.info(req.user, "User logged out successfully");
        res.status(204).send();
      });
    });
  },
);

export default router;
