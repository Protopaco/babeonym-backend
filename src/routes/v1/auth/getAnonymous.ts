import { Router } from 'express';
const router = Router();
import createUser from '../../../db/createUser.js';
import AuthProvider from '../../../models/AuthProvider.js';
import { logger } from '../../../utils/logger.js';

/**
 * @swagger
 * /api/v1/auth/anonymous:
 *   get:
 *     operationId: createAnonymousSession
 *     tags: [Auth]
 *     summary: Create an anonymous user session
 *     description: Creates a new anonymous user session without requiring authentication
 *     responses:
 *       200:
 *         description: Anonymous session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *               example:
 *                 message: "Anonymous session created"
 *       500:
 *         description: Failed to create anonymous session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 error: "Failed to create anonymous session"
 */
router.get('/anonymous', async (req, res) => {
    // Create an anonymous user session
    if (req.user) {
        return res.status(400).json({ error: 'User is already authenticated' });
    }

    const user = await createUser(AuthProvider.ANONYMOUS);
    logger.info(`Created anonymous user with ID: ${user.id}`);

    req.login(user, { session: true }, (err) => {
        console.log('Set-Cookie:', res.getHeader('Set-Cookie'));
        if (err) {
            logger.error('Error logging in anonymous user:', err);
            return res.status(500).json({ error: 'Failed to create anonymous session' });
        }
        res.status(200).json({ message: 'Anonymous session created', user });
    });

});

export default router;