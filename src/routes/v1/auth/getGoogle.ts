import { Router } from "express";
const router = Router();
import passport from "passport";

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     operationId: v1AuthGoogle
 *     summary: Start Google OAuth login
 *     description: Redirects the user to Google OAuth consent screen.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth provider
 *         headers:
 *           Location:
 *             description: Redirect URL
 *             schema:
 *               type: string
 */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "email"] }),
);

export default router;
