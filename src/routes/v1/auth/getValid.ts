import { Router } from 'express';
const router = Router();


/**
 * @swagger
 * /api/v1/auth/valid:
 *   get:
 *     operationId: checkAuthValidity
 *     tags: [Auth]
 *     summary: Check if the current user session is valid
 *     description: Validates whether a user is currently authenticated
 *     responses:
 *       200:
 *         description: Authentication status returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Whether the user is authenticated
 *                 anonymous:
 *                   type: boolean
 *                   description: Whether the user is anonymous (only present if valid is true)
 *               example:
 *                 valid: true
 *                 anonymous: true
 */
router.get('/valid', (req, res) => {
    if (req.user) {
        res.status(200).json({ valid: true, anonymous: true });
    } else {
        res.status(200).json({ valid: false });
    }
});

export default router;