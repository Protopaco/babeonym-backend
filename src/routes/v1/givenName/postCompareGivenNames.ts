import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import compareGivenNames from "../../../db/compareGivenNames";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User.js";

/**
 * @swagger
 * /api/v1/givenName/compare:
 *   post:
 *     operationId: v1GivenNameCompare
 *     summary: Compare two given names
 *     description: Records a comparison result between two given names for the authenticated user.
 *     tags:
 *       - GivenName
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/V1GivenNameCompareRequest'
 *     responses:
 *       200:
 *         description: Comparison recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid winnerId or loserId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 */

router.post(
  "/compare",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const { winnerId, loserId } = req.body;
    if (
      typeof winnerId !== "number" ||
      typeof loserId !== "number" ||
      winnerId <= 0 ||
      loserId <= 0
    ) {
      return res.status(400).json({ message: "Invalid winnerId or loserId" });
    }
    logger.info(
      `User ${userId} compared given names: winnerId=${winnerId}, loserId=${loserId}`,
    );

    await compareGivenNames(userId, winnerId, loserId);
    res
      .status(200)
      .json({ message: "Given name comparison updated successfully" });
  },
);

export default router;
