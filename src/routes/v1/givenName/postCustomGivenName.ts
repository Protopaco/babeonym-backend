import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated';
import addCustomGivenName from '../../../db/addCustomGivenName';
import { logger } from '../../../utils/logger.js';


/**
 * @swagger
 * /api/v1/givenName/custom:
 *   post:
 *     operationId: addCustomGivenName
 *     tags: [Given Name]
 *     summary: Add a custom given name
 *     description: Adds a custom given name for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customGivenName
 *             properties:
 *               customGivenName:
 *                 type: string
 *                 description: The custom given name to add
 *           example:
 *             customGivenName: "Alex"
 *     responses:
 *       200:
 *         description: Custom given name added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Custom given name added successfully"
 *       400:
 *         description: Invalid custom given name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid custom given name"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to add custom given name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Failed to add custom given name"
 */
router.post('/custom', ensureAuthenticated, async (req: Request, res: Response) => {
    logger.debug(req.body);
    const { customGivenName } = req.body;
    if (!customGivenName || typeof customGivenName !== 'string') {
        return res.status(400).json({ error: 'Invalid custom given name' });
    }

    await addCustomGivenName(req.user!.id, customGivenName);
    res.status(200).json({ message: 'Custom given name added successfully' });
});

export default router;