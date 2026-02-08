import { Router } from "express";
const router = Router();
import passport from "passport";

/**
 * @swagger
 * /auth/microsoft:
 *   get:
 *     summary: Start Microsoft OAuth login
 *     description: Redirects the user to Microsoft OAuth consent screen.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to Microsoft OAuth provider
 */

router.get(
  "/microsoft",
  passport.authenticate("microsoft", { scope: ["openid", "email"] }),
);

export default router;
