import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import compareGivenNames from "../../../db/compareGivenNames";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User.js";

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
      return res.status(400).json({ error: "Invalid winnerId or loserId" });
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
