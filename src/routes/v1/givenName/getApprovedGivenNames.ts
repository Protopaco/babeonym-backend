import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import getApprovedGivenNames from "../../../db/getApprovedGivenNames";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User";

/**
 * @swagger
 * /api/v1/givenName/approved:
 *   get:
 *     summary: Get approved given names for authenticated user
 *     description: Retrieves all approved given names for the currently authenticated user
 *     tags:
 *       - Given Name
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved approved given names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The given name ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The given name
 *                     example: "Sophia"
 *                   approvedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the name was approved
 *                     example: "2026-01-31T10:30:00Z"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authentication required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch approved given names"
 */

router.get(
  "/approved",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(
      `Received request for approved given names from user ID: ${userId}`,
    );
    const approvedGivenNames = await getApprovedGivenNames(userId);
    logger.debug(approvedGivenNames);
    res.status(200).json(approvedGivenNames);
  },
);

export default router;
