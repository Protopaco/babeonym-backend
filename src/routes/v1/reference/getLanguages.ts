import { Router, Request, Response } from "express";
const router = Router();
import ensureAuthenticated from "../../../middleware/ensureAuthenticated.js";
import { logger } from "../../../utils/logger.js";
import getLanguages from "../../../db/getLanguages.js";
import Languages from "../../../models/Languages.js";
import User from "../../../models/User.js";

/**
 * @swagger
 * /api/v1/reference/languages:
 *   get:
 *     operationId: v1ReferenceLanguages
 *     summary: Get languages
 *     description: Returns the list of available languages.
 *     tags:
 *       - Reference
 *     responses:
 *       200:
 *         description: List of languages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [languages]
 *               properties:
 *                 languages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Language'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotAuthenticatedResponse'
 */

router.get(
  "/languages",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const userId = (req.user as User).id;
    logger.info("Received request for languages from user ID: " + userId);
    const languages: Languages = await getLanguages();
    res.status(200).json({ languages });
  },
);

export default router;
