import { Router, Request, Response } from "express";
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger.js";
const router = Router();

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: >
 *       Logs out the currently authenticated user and destroys the session.
 *     tags:
 *       - Auth
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
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

router.post("/logout", ensureAuthenticated, (req: Request, res: Response) => {
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
});

export default router;
