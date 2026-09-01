import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger";
import isBadWord from "../../../utils/isBadWord.js";
import updateUserSettings from "../../../db/updateUserSettings";
import UserSettings from "../../../models/UserSettings";
import User from "../../../models/User";

/**
 * @swagger
 * /api/v1/user/settings:
 *   put:
 *     operationId: v1UserSettings
 *     summary: Update user settings
 *     description: Updates the authenticated user's settings such as surname.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/V1UserSettingsRequest'
 *     responses:
 *       200:
 *         description: User settings updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSettingsResponse'
 *       400:
 *         description: Invalid input (invalid surName value or inappropriate language)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/NotAuthenticated'
 *       500:
 *         description: Failed to update user settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.put(
  "/settings",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    const { surName: rawSurName } = req.body;

    logger.info(
      `Received request to update settings for user ID: ${userId} with surName: ${rawSurName}`,
    );

    if (rawSurName !== undefined && rawSurName !== null) {
      if (typeof rawSurName !== "string") {
        logger.warn(`Invalid surName type for user ID: ${userId}`);
        return res.status(400).send({ message: "Invalid surName value" });
      }
    }

    // An omitted, null, or blank surname all mean "no surname set". The column
    // is nullable, so they normalize to null rather than an empty string.
    const trimmedSurName =
      typeof rawSurName === "string" ? rawSurName.trim() : "";
    const surName = trimmedSurName === "" ? null : trimmedSurName;

    if (surName !== null && isBadWord(surName)) {
      logger.warn(
        `Attempt to set surName to a bad word for user ID: ${userId}`,
      );
      return res
        .status(400)
        .send({ message: "surName contains inappropriate language" });
    }

    try {
      const updatedSettings: UserSettings = await updateUserSettings(
        userId,
        surName,
      );
      logger.info(`Successfully updated settings for user ID: ${userId}`);
      res.status(200).send({ settings: updatedSettings });
    } catch (error) {
      logger.error(`Error updating settings for user ID: ${userId}: ${error}`);
      res
        .status(500)
        .send({ message: "An error occurred while updating settings" });
    }
  },
);

export default router;
