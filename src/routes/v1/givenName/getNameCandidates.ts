import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";

import { logger } from "../../../utils/logger.js";
import getNameCandidates from "../../../db/getNameCandidates.js";
import { GenderType } from "../../../models/Gender.js";
import User from "../../../models/User.js";
import GivenName from "../../../models/GivenName.js";

/**
 * @swagger
 * api/v1/givenName/candidates:
 *   get:
 *     summary: Get given name candidates
 *     description: Returns candidate given names for the authenticated user based on optional filters.
 *     tags:
 *       - GivenName
 *     parameters:
 *       - in: query
 *         name: popularity
 *         required: false
 *         schema:
 *           type: number
 *         description: Popularity filter
 *       - in: query
 *         name: genders
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of genders
 *       - in: query
 *         name: decadeIds
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated decade IDs
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Maximum number of results
 *       - in: query
 *         name: include
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated include options (e.g. meta)
 *     responses:
 *       200:
 *         description: Candidate given names
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
  "/candidates",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(`GET name candidates by user ID: ${userId}`);
    const popularity = Number(req.query.popularity) || null;
    const genders: GenderType[] | null = req.query.genders
      ? String(req.query.genders).split(",")
      : null;

    const decadeIds = req.query.decadeIds
      ? (req.query.decadeIds as string).split(",").map(Number)
      : null;
    const limit = req.query.limit ? Number(req.query.limit) : null;
    const include = String(req.query.include ?? "")
      .split(",")
      .filter(Boolean);
    const includeMeta = include.includes("meta");

    const givenNames: GivenName[] = await getNameCandidates(
      userId,
      popularity,
      genders,
      decadeIds,
      limit,
      includeMeta,
    );

    res.status(200).json(givenNames);
  },
);

export default router;
