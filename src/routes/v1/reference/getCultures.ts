import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';
import { logger } from '../../../utils/logger.js';
import getCultures from '../../../db/getCultures.js';


/**
 * @swagger
 * /api/v1/reference/cultures:
 *   get:
 *     operationId: getCultures
 *     tags: [Reference]
 *     summary: Get list of cultures
 *     description: Returns all supported cultures
 *     responses:
 *       200:
 *         description: Cultures returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cultures:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 cultures: ["American", "British", "Japanese"]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Unauthorized"
 *       500:
 *         description: Failed to fetch cultures
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Failed to fetch cultures"
 */

router.get('/cultures', ensureAuthenticated, async (req: Request, res: Response) => {
    const cultures = await getCultures();
    logger.debug(cultures);
    res.status(200).json({ cultures });
});

export default router;
