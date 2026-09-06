import { Router } from "express";
const router = Router();
import createUser from "../../../db/createUser";
import AuthProvider from "../../../models/AuthProvider";
import { logger } from "../../../utils/logger";
import anonymousSessionRateLimit from "../../../middleware/anonymousSessionRateLimit";

/**
 * @swagger
 * /api/v1/auth/anonymous:
 *   get:
 *     operationId: v1AuthAnonymous
 *     summary: Create an anonymous user session
 *     description: Creates a new anonymous user and logs them in via session cookie.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Anonymous session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/V1AuthAnonymous200Response'
 *       400:
 *         description: User is already authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/V1AuthAnonymous400Response'
 *       429:
 *         description: Too many sessions created from this address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get("/anonymous", anonymousSessionRateLimit, async (req, res) => {
  // Create an anonymous user session
  if (req.user) {
    return res.status(400).json({ error: "User is already authenticated" });
  }

  const user = await createUser(AuthProvider.ANONYMOUS);
  logger.info(`Created anonymous user with ID: ${user.id}`);

  req.login(user, { session: true }, (err) => {
    logger.info(`Logging in anonymous user with ID: ${user.id}`);
    if (err) {
      logger.error("Error logging in anonymous user:", err);
      return res
        .status(500)
        .json({ error: "Failed to create anonymous session" });
    }
    res.status(200).json({ message: "Anonymous session created", user });
  });
});

export default router;
