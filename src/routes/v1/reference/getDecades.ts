import { Router, Request, Response } from "express";
const router = Router();
import getReferenceDecades from "../../../db/getDecades";
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import Decade from "../../../models/Decade";
import User from "../../../models/User";

/**
 * @swagger
 * /api/v1/reference/decades:
 *   get:
 *     operationId: v1ReferenceDecades
 *     summary: Get decades
 *     description: Returns the list of available decades.
 *     tags:
 *       - Reference
 *     responses:
 *       200:
 *         description: List of decades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [decades]
 *               properties:
 *                 decades:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Decade'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.get(
  "/decades",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(`Reference Decades endpoint called for user ${userId}`);
    const decades: Decade[] = await getReferenceDecades();
    res.status(200).json({ decades });
  },
);

export default router;
