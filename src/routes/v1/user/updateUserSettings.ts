import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import isBadWord from "../../../utils/isBadWord.js";
import updateUserSettings from "../../../db/updateUserSettings";
import UserSettings from "../../../models/UserSettings";
import User from "../../../models/User";
import { parseTheme } from "../../../models/Theme";

/**
 * @swagger
 * /api/v1/user/settings:
 *   put:
 *     operationId: v1UserSettings
 *     summary: Update user settings
 *     description: Updates the authenticated user's settings such as theme and surname.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [theme, surName]
 *             properties:
 *               theme:
 *                 type: string
 *                 description: Theme identifier
 *               surName:
 *                 type: string
 *                 description: User surname
 *     responses:
 *       200:
 *         description: User settings updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [settings]
 *               properties:
 *                 settings:
 *                   $ref: '#/components/schemas/UserSettings'
 *       400:
 *         description: Invalid input (missing fields, invalid theme, or inappropriate language)
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
 *       500:
 *         description: Failed to update user settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while updating settings
 */

router.put(
  "/settings",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const { theme: rawTheme, surName } = req.body;

    logger.info(
      `Received request to update settings for user ID: ${userId} with theme: ${rawTheme} and surName: ${surName}`,
    );

    if (rawTheme === undefined || surName === undefined) {
      logger.warn(
        `Missing theme or surName in request body for user ID: ${userId}`,
      );
      return res
        .status(400)
        .send({ error: "Missing theme or surName in request body" });
    }
    const theme = parseTheme(rawTheme);
    if (theme === null) {
      logger.warn(`Invalid theme value: ${rawTheme} for user ID: ${userId}`);
      return res.status(400).send({ error: "Invalid theme value" });
    }

    const surNameNaughty = isBadWord(surName);
    if (surNameNaughty) {
      logger.warn(
        `Attempt to set surName to a bad word for user ID: ${userId}`,
      );
      return res
        .status(400)
        .send({ error: "surName contains inappropriate language" });
    }

    try {
      const updatedSettings: UserSettings = await updateUserSettings(
        userId,
        theme,
        surName,
      );
      logger.info(`Successfully updated settings for user ID: ${userId}`);
      res.status(200).send({ settings: updatedSettings });
    } catch (error) {
      logger.error(`Error updating settings for user ID: ${userId}: ${error}`);
      res
        .status(500)
        .send({ error: "An error occurred while updating settings" });
    }
  },
);

export default router;
