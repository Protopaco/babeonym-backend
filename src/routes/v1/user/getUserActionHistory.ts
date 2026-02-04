import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import getUserActionHistory from "../../../db/getUserActionHistory.js";
import User from "../../../models/User";

router.get(
  "/actionHistory",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    if (!req.user) {
      logger.warn("User not found in request object");
      return res.status(404).json({ error: "User not found" });
    }
    const userId = (req.user as User).id;
    const actionHistory = await getUserActionHistory(userId);
    res.status(200).json({ actionHistory });
  },
);

export default router;
