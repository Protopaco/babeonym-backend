import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import deleteUser from "../../../db/deleteUser.js";

router.delete(
  "/me",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    logger.info(`Deleting user with ID: ${userId}`);
    await deleteUser(userId!);

    req.logout(function (err) {
      if (err) {
        logger.error(err);
        return res.status(500).json({ message: "Logout failed" });
      }
      req.session?.destroy(() => {
        logger.info(req.user, "User logged out successfully");
        res.status(204).send();
      });
    });
  },
);

export default router;
