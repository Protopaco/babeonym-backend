import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import updateUserTheme from "../../../db/updateUserTheme";
import User from "../../../models/User";
import { parseTheme } from "../../../models/Theme";

/**
 * @swagger
 * /api/v1/user/theme:
 *   put:
 *     operationId: v1UserTheme
 *     summary: Update user theme
 *     description: Updates the authenticated user's theme.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/V1UserThemeRequest'
 *     responses:
 *       204:
 *         description: User theme updated
 *       400:
 *         description: Invalid input (missing or invalid theme)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 *       500:
 *         description: Failed to update user theme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/theme",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const { theme: rawTheme } = req.body;

    logger.info(
      `Received request to update theme for user ID: ${userId} to: ${rawTheme}`,
    );

    if (rawTheme === undefined) {
      logger.warn(`Missing theme in request body for user ID: ${userId}`);
      return res.status(400).send({ message: "Missing theme in request body" });
    }

    const theme = parseTheme(rawTheme);
    if (theme === null) {
      logger.warn(`Invalid theme value: ${rawTheme} for user ID: ${userId}`);
      return res.status(400).send({ message: "Invalid theme value" });
    }

    try {
      await updateUserTheme(userId, theme);
      logger.info(`Successfully updated theme for user ID: ${userId}`);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error updating theme for user ID: ${userId}: ${error}`);
      res
        .status(500)
        .send({ message: "An error occurred while updating the theme" });
    }
  },
);

export default router;
