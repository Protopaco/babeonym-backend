import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import NameState from "../../../models/NameState";
import updateGivenNameAction from "../../../db/updateGivenNameAction";
import User from "../../../models/User";

router.post(
  "/action",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    logger.debug(req.body);
    const { givenCustomNameBridgeId, newState } = req.body;
    if (
      typeof givenCustomNameBridgeId !== "number" ||
      !newState ||
      (newState !== NameState.APPROVED &&
        newState !== NameState.REJECTED &&
        newState !== NameState.SNOOZED)
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    const userId = (req.user as User).id;

    await updateGivenNameAction(userId, givenCustomNameBridgeId, newState);
    res.status(200).json({ message: "Given name action updated successfully" });
  },
);

export default router;
