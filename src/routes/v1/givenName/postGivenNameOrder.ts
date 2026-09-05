import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import setGivenNameOrder from "../../../db/setGivenNameOrder";
import getApprovedGivenNames from "../../../db/getApprovedGivenNames";
import shouldPromptAccountCreation from "../../../utils/shouldPromptAccountCreation.js";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User.js";

/**
 * @swagger
 * /api/v1/givenName/order:
 *   post:
 *     operationId: v1GivenNameOrder
 *     summary: Set the order of the user's approved given names
 *     description: >
 *       Rewrites the authenticated user's ratings so the approved list matches
 *       the submitted order. Ratings are respaced evenly rather than nudged, so
 *       the order holds even for a user who has never compared any names.
 *     tags:
 *       - GivenName
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/V1GivenNameOrderRequest'
 *     responses:
 *       200:
 *         description: The user's approved given names in their new order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GivenNameMutationResponse'
 *       400:
 *         description: Invalid or unrecognised given name order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 */

router.post(
  "/order",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const userId = user.id;

    const { givenCustomNameBridgeIds } = req.body;
    if (
      !Array.isArray(givenCustomNameBridgeIds) ||
      givenCustomNameBridgeIds.length === 0 ||
      givenCustomNameBridgeIds.some(
        (bridgeId) => typeof bridgeId !== "number" || bridgeId <= 0,
      )
    ) {
      return res.status(400).json({ error: "Invalid given name order" });
    }

    // A repeated id would place one name twice and silently drop another, so it
    // is rejected rather than resolved to whichever position came last.
    if (
      new Set(givenCustomNameBridgeIds).size !== givenCustomNameBridgeIds.length
    ) {
      return res
        .status(400)
        .json({ error: "Given name order contains duplicates" });
    }

    logger.info(
      `User ${userId} reordered ${givenCustomNameBridgeIds.length} given names`,
    );

    try {
      await setGivenNameOrder(userId, givenCustomNameBridgeIds);
    } catch (error) {
      // set_given_name_order raises when an id is not one of this user's
      // approved names, which is a bad request rather than a server fault.
      logger.warn(`Rejected given name order for user ${userId}: ${error}`);
      return res.status(400).json({ error: "Invalid given name order" });
    }

    const approvedGivenNames = await getApprovedGivenNames(userId);
    const promptAccountCreation = await shouldPromptAccountCreation(user);
    res
      .status(200)
      .json({ approvedGivenNames, user: { promptAccountCreation } });
  },
);

export default router;
