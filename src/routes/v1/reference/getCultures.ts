import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import getCultures from "../../../db/getCultures";
import Cultures from "../../../models/Cultures";
import User from "../../../models/User";

/**
 * @swagger
 * /api/v1/reference/cultures:
 *   get:
 *     operationId: v1ReferenceCultures
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
 *               $ref: '#/components/schemas/ReferenceCulturesResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 */

router.get(
  "/cultures",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info("Received request for cultures from user ID: " + userId);
    const cultures: Cultures = await getCultures();
    res.status(200).json({ cultures });
  },
);

export default router;
