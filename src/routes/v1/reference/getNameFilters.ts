import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import getNameFilters from "../../../db/getNameFilters";
import NameFilters from "../../../models/NameFilters";
import User from "../../../models/User";

/**
 * @swagger
 * /api/v1/reference/nameFilters:
 *   get:
 *     operationId: v1ReferenceNameFilters
 *     summary: Get name filter options
 *     description: >
 *       Returns every filter option the name workspace offers, grouped by
 *       filter type. Each option carries the same shape, so a picker can render
 *       any group without knowing which one it has.
 *     tags:
 *       - Reference
 *     responses:
 *       200:
 *         description: Name filter options
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReferenceNameFiltersResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 */

router.get(
  "/nameFilters",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info("Received request for name filters from user ID: " + userId);
    const nameFilters: NameFilters = await getNameFilters();
    // Filter options change a couple of times a year, so the browser keeps its
    // copy for a day instead of asking again. Private because the route needs a
    // session; after a day the browser revalidates against Express's ETag and
    // gets a 304 when nothing changed.
    res.set("Cache-Control", "private, max-age=86400");
    res.status(200).json({ nameFilters });
  },
);

export default router;
