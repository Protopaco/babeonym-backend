import express, { Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
import linkAuthProvider from "../../../db/linkAuthProvider";
import User from "../../../models/User.js";
import { logger } from "../../../utils/logger.js";
import AuthProvider from "../../../models/AuthProvider.js";

dotenv.config();
const router = express.Router();
const frontEndBaseUrl =
  process.env.FRONTEND_BASE_URL || "http://localhost:4200";

/**
 * @swagger
 * /api/v1/auth/microsoft/callback:
 *   get:
 *     operationId: v1AuthMicrosoftCallback
 *     summary: Handle Microsoft OAuth callback
 *     description: >
 *       Handles the Microsoft OAuth callback, links or logs in a user as needed,
 *       and redirects to the frontend with success or error state.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         required: false
 *         schema:
 *           type: string
 *         description: OAuth authorization code returned by Microsoft
 *       - in: query
 *         name: error
 *         required: false
 *         schema:
 *           type: string
 *         description: OAuth error returned by Microsoft
 *     responses:
 *       302:
 *         description: Redirect to frontend (success, linking flow, or error)
 */

router.get("/microsoft/callback", async (req, res, next) => {
  const cookieUser = req.user as User | undefined;

  if (req.query.error) {
    return res.redirect(
      `${frontEndBaseUrl}/login?error=oauth&details=${req.query.error}`,
    );
  }

  if (!req.query.code) {
    return res.redirect(`${frontEndBaseUrl}/login?error=oauth&details=no_code`);
  }

  await passport.authenticate("microsoft", async (err: any, user: any) => {
    if (err) {
      return res.redirect(`${frontEndBaseUrl}/login?error=oauth`);
    }

    if (!user || typeof user !== "object") {
      return res.redirect(
        `${frontEndBaseUrl}/login?error=oauth&details=no_user`,
      );
    }

    if (user.isNewUser && !cookieUser) {
      return res.redirect(
        `${frontEndBaseUrl}/user/redirect?email=${encodeURIComponent(
          user.email ?? "",
        )}&microsoftId=${encodeURIComponent(user.microsoftId)}`,
      );
    } else if (user.isNewUser && cookieUser) {
      logger.info(
        `Linking new Microsoft account ${user.email} to existing user ${cookieUser.id}`,
      );
      await linkAuthProvider(
        cookieUser.id,
        AuthProvider.MICROSOFT,
        user.microsoftId,
        user.email,
      );
      logger.info(
        `Successfully linked Microsoft account ${user.email} to user ${cookieUser.id}`,
      );
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.redirect(`${frontEndBaseUrl}/user/login?error=oauth`);
      }
      return res.redirect(`${frontEndBaseUrl}/user/login/success`);
    });
  })(req, res, next);
});

export default router;
