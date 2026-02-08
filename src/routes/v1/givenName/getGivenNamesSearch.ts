import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import getGivenNamesSearch from "../../../db/givenNamesSearch.js";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User";
import GivenName from "../../../models/GivenName.js";

/**
 * @swagger
 * /givenName/search:
 *   get:
 *     summary: Search given names
 *     description: >
 *       Searches given names for the authenticated user using a text query.
 *     tags:
 *       - GivenName
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search text for given names
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: Matching given names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GivenName'
 *       400:
 *         description: Missing required search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Query parameter 'search' is required
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.get(
  "/search",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const searchText = (req.query.search as string) || "";
    const limit = parseInt((req.query.limit as string) || "10", 10);

    if (!searchText) {
      res.status(400).json({ error: "Query parameter 'search' is required" });
      return;
    }

    logger.info(
      `Received request to search given names for user ID: ${user.id} with search text: "${searchText}"`,
    );

    const givenNames: GivenName[] = await getGivenNamesSearch(
      user.id,
      searchText,
      limit,
    );
    res.status(200).json(givenNames);
  },
);
export default router;
