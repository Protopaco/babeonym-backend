import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger.js";
import getCultures from "../../../db/getCultures.js";
import { Culture } from "../../../models/Culture.js";

/**
 * @swagger
 * api/v1/reference/cultures:
 *   get:
 *     summary: Get cultures
 *     description: Returns the list of available cultures.
 *     tags:
 *       - Reference
 *     responses:
 *       200:
 *         description: List of cultures
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [cultures]
 *               properties:
 *                 cultures:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Culture'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.get(
  "/cultures",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as any).id;
    logger.info("Received request for cultures from user ID: " + userId);
    const cultures: Culture[] = await getCultures();
    res.status(200).json({ cultures });
  },
);

export default router;
