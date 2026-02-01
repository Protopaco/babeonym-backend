import { Router, Request, Response } from 'express';
const router = Router();
import getReferenceDecades from '../../../db/getDecades.js'
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';
import { logger } from '../../../utils/logger.js';

/**
 * @swagger
 * /api/v1/reference/decades:
 *   get:
 *     operationId: getReferenceDecades
 *     tags: [Reference]
 *     summary: Get available decades for reference
 *     description: Retrieves a list of decades available in the reference database
 *     responses:
 *       200:
 *         description: Successfully retrieved reference decades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to fetch reference decades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Failed to fetch decades
 */
router.get('/decades', ensureAuthenticated, async (req: Request, res: Response) => {
    try {
        const decades = await getReferenceDecades();
        logger.debug(decades, "Fetched reference decades");
        res.status(200).json({ decades });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Failed to fetch decades' });
    }
    //res.status(200).json({ decades: [] });
});

export default router;  