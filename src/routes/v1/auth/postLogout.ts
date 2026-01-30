import router from '../../../utils/router.js'
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     operationId: logoutUser
 *     tags: [Auth]
 *     summary: Log out the current user
 *     responses:
 *       204:
 *         description: Successfully logged out
 */
router.post('/logout', ensureAuthenticated, (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session?.destroy(() => {
            res.status(204).send();
        });
    });
});

export default router;
