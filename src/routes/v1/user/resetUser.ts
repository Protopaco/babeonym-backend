import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import User from "../../../models/User";
import resetUser from "../../../db/resetUser";

router.post(
  "/me/reset",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info(`Resetting user with ID: ${userId}`);
    await resetUser(userId!);
    res.status(200).json({ message: "User reset successfully" });
  },
);

export default router;
