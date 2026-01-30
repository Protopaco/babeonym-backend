import router from '../../../utils/router.js'
import passport from 'passport';

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     operationId: initiateGoogleAuth
 *     tags: [Auth]
 *     summary: Redirect user to Google for authentication
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth
 */
router.get('/google', passport.authenticate('google', { scope: ['openid', 'email'] }));

export default router;
