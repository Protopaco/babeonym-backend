import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated";
import addCustomGivenName from "../../../db/addCustomGivenName";
import { logger } from "../../../utils/logger.js";
import User from "../../../models/User.js";
import isBadWord from "../../../utils/isBadWord.js";

/**
 * @swagger
 * /api/v1/givenName/custom:
 *   post:
 *     operationId: v1GivenNameCustom
 *     summary: Add a custom given name
 *     description: Adds a user-defined custom given name for the authenticated user.
 *     tags:
 *       - GivenName
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customGivenName]
 *             properties:
 *               customGivenName:
 *                 type: string
 *                 example: "Aurelius"
 *     responses:
 *       200:
 *         description: Custom given name added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Custom given name added successfully
 *       400:
 *         description: Invalid or inappropriate custom given name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.post(
  "/custom",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info("Custom given name request by user ID: " + userId);

    const { customGivenName } = req.body;
    if (!customGivenName || typeof customGivenName !== "string") {
      return res.status(400).json({ error: "Invalid custom given name" });
    }

    if (isBadWord(customGivenName)) {
      return res
        .status(400)
        .json({ error: "customGivenName contains inappropriate language" });
    }

    await addCustomGivenName(userId, customGivenName);
    res.status(200).json({ message: "Custom given name added successfully" });
  },
);

export default router;
