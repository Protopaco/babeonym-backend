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
 * /api/v1/givenName/candidates:
 *   get:
 *     operationId: v1GivenNameCandidates
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
 *         description: Popularity percentile target from 0.0 to 1.0.
 *       - in: query
 *         name: genders
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of genders.
 *         example: male,female
 *       - in: query
 *         name: decadeIds
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of decade IDs.
 *         example: 1,2,3
 *       - in: query
 *         name: languageIds
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of language IDs.
 *         example: 4,7
 *       - in: query
 *         name: cultureIds
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated list of culture IDs.
 *         example: 2,9
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Maximum number of results.
 *       - in: query
 *         name: excludeBridgeIds
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Comma-separated list of given custom name bridge IDs the caller
 *           already holds. Used to top up a partly full queue without being
 *           handed the same names back.
 *         example: 12,48,93
 *       - in: query
 *         name: include
 *         required: false
 *         schema:
 *           type: string
 *         description: Comma-separated include options.
 *         example: meta
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
 *         $ref: '#/components/responses/NotAuthenticated'
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
    const languageIds = req.query.languageIds
      ? (req.query.languageIds as string).split(",").map(Number)
      : null;
    const cultureIds = req.query.cultureIds
      ? (req.query.cultureIds as string).split(",").map(Number)
      : null;
    const limit = req.query.limit ? Number(req.query.limit) : null;
    const excludeBridgeIds = req.query.excludeBridgeIds
      ? (req.query.excludeBridgeIds as string)
          .split(",")
          .map(Number)
          .filter(Number.isInteger)
      : null;
    const include = String(req.query.include ?? "")
      .split(",")
      .filter(Boolean);
    const includeMeta = include.includes("meta");

    const givenNames: GivenName[] = await getNameCandidates(
      userId,
      popularity,
      genders,
      decadeIds,
      languageIds,
      cultureIds,
      limit,
      includeMeta,
      excludeBridgeIds,
    );

    res.status(200).json(givenNames);
  },
);

export default router;
