import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import getApprovedGivenNames from "../../../db/getApprovedGivenNames";
import { logger } from "../../../utils/logger";
import User from "../../../models/User";
import GivenName from "../../../models/GivenName";

/**
 * @swagger
 * /api/v1/givenName/approved:
 *   get:
 *     operationId: v1GivenNameApproved
 *     summary: Get approved given names
 *     description: Returns the authenticated user's approved given names.
 *     tags:
 *       - GivenName
 *     responses:
 *       200:
 *         description: Approved given names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GivenName'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.get(
  "/approved",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(
      `Received request for approved given names from user ID: ${userId}`,
    );
    const approvedGivenNames: GivenName[] = await getApprovedGivenNames(userId);
    res.status(200).json(approvedGivenNames);
  },
);

export default router;
