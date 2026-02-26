import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import { logger } from "../../../utils/logger";
import Etymology from "../../../models/Etymology";
import getEtymology from "../../../db/getEtymology";

/**
 * @swagger
 * /api/v1/givenName/etymology/{givenCustomNameBridgeId}:
 *   get:
 *     operationId: v1GivenNameEtymology
 *     summary: Get given name etymology
 *     description: Returns etymology information for a specific given name.
 *     tags:
 *       - GivenName
 *     parameters:
 *       - in: path
 *         name: givenCustomNameBridgeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the given name
 *     responses:
 *       200:
 *         description: Etymology data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etymology'
 *       400:
 *        description: Invalid givenCustomNameBridgeId
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.get(
  "/etymology/:givenCustomNameBridgeId",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const givenCustomNameBridgeId = Number(req.params.givenCustomNameBridgeId);
    if (Number.isNaN(givenCustomNameBridgeId)) {
      return res
        .status(400)
        .json({ message: "Invalid givenCustomNameBridgeId" });
    }
    logger.info(`Given name etymology request. Id: ${givenCustomNameBridgeId}`);

    const givenNameEtymology = (await getEtymology(
      givenCustomNameBridgeId,
    )) as Etymology;

    res.status(200).json(givenNameEtymology);
  },
);

export default router;
