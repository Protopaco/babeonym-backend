
import { Router, Request, Response } from 'express';
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';
import { logger } from '../../../utils/logger.js';
const router = Router();

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     operationId: logoutUser
 *     tags: [Auth]
 *     summary: Log out the current user
 *     description: Ends the authenticated user session and clears the session cookie
 *     responses:
 *       204:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 error: "Unauthorized"
 *       500:
 *         description: Logout failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 message: "Logout failed"
 */
router.post('/logout', ensureAuthenticated, (req: Request, res: Response) => {
    req.logout(function (err) {
        if (err) {
            logger.error(err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session?.destroy(() => {
            logger.info(req.user, 'User logged out successfully');
            res.status(204).send();
        });
    });
});

export default router;