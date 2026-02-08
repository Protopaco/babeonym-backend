import { Router } from "express";
const router = Router();
import passport from "passport";
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google OAuth login
 *     description: Redirects the user to Google OAuth consent screen.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth provider
 */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "email"] }),
);

export default router;
