import router from '../../../utils/router.js'
import getReferenceDecades from '../../../db/getReferenceDecades.js'

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
 *                 error: Failed to fetch reference decades
 */
router.get('/decades', async (req, res) => {
    try {
        const decades = await getReferenceDecades();
        console.log("🚀 ~ decades:", decades)
        res.status(200).json({ decades });
    } catch (error) {
        console.error('Error fetching reference decades:', error);
        res.status(500).json({ error: 'Failed to fetch reference decades' });
    }
});

export default router;  