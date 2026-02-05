import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import getGivenNamesSearch from "../../../db/givenNamesSearch.js";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User";

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

    const givenNames = await getGivenNamesSearch(user.id, searchText, limit);
    res.status(200).json(givenNames);
  },
);
export default router;
