import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import User from "../../../models/User.js";

router.get("/me", ensureAuthenticated, async (req: Request, res: Response) => {
  const userId = (req.user as User).id;
  logger.info(`Fetching user information for user ID: ${userId}`);
  res.status(200).send({ user: req.user });
});

export default router;
