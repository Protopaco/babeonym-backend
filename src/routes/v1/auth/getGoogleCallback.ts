import express, { Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
import linkAuthProvider from "../../../db/linkAuthProvider";
import createUser from "../../../db/createUser";
import User from "../../../models/User";
import { logger } from "../../../utils/logger";
import AuthProvider from "../../../models/AuthProvider";

dotenv.config();
const router = express.Router();
const frontEndBaseUrl =
  process.env.FRONTEND_BASE_URL || "http://localhost:2223";

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     operationId: v2AuthGoogleCallback
 *     summary: Handle Google OAuth callback
 *     description: >
 *       Handles the Google OAuth callback, links or logs in a user as needed,
 *       and redirects to the frontend with success or error state.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         required: false
 *         schema:
 *           type: string
 *         description: OAuth authorization code returned by Google
 *       - in: query
 *         name: authError
 *         required: false
 *         schema:
 *           type: string
 *         description: OAuth error returned by Google
 *     responses:
 *       302:
 *         description: Redirect to frontend (success, linking flow, or error)
 */

router.get("/google/callback", async (req, res, next) => {
  const cookieUser = req.user as User | undefined;
  // Check if Google sent an error
  if (req.query.error) {
    logger.error(req.query.error, "Error received from Google OAuth callback");
    return res.redirect(
      `${frontEndBaseUrl}/error?error=oauth&details=${req.query.error}`,
    );
  }

  // Check if we have an authorization code
  if (!req.query.code) {
    logger.error("No authorization code received from Google");
    return res.redirect(`${frontEndBaseUrl}/error?error=oauth&details=no_code`);
  }

  await passport.authenticate(
    "google",
    async (err: any, user: any, info: any) => {
      if (err) {
        logger.error("Google OAuth error:", err);
        return res.redirect(`${frontEndBaseUrl}/error?error=oauth`);
      }
      if (!user) {
        logger.error("No user returned from OAuth strategy");
        return res.redirect(
          `${frontEndBaseUrl}/error?error=oauth&details=no_user`,
        );
      }

      // Extra safety check - make sure user is not false or other falsy values
      if (user === false || typeof user !== "object") {
        logger.error(user, "Invalid user object type");
        return res.redirect(
          `${frontEndBaseUrl}/error?error=oauth&details=invalid_user`,
        );
      }

      if (user.isNewUser && !cookieUser) {
        logger.info("New user detected:", user.email);
        const createdUser = await createUser(
          AuthProvider.GOOGLE,
          user.googleId,
          user.email,
        );
        logger.info(
          `Created new user ${createdUser.id} for Google account ${user.email}`,
        );
        return req.logIn(createdUser, (err) => {
          if (err) {
            logger.error(err, "Login error after creating new Google user");
            return res.redirect(`${frontEndBaseUrl}/error?error=oauth`);
          }
          return res.redirect(`${frontEndBaseUrl}/`);
        });
      } else if (user.isNewUser && cookieUser) {
        logger.info(
          `Linking new Google account ${user.email} to existing user ${cookieUser.id}`,
        );
        await linkAuthProvider(
          cookieUser.id,
          AuthProvider.GOOGLE,
          user.googleId,
          user.email,
        );
        logger.info(
          `Successfully linked Google account ${user.email} to user ${cookieUser.id}`,
        );
        return req.logIn(cookieUser, (err) => {
          if (err) {
            logger.error(err, "Login error after linking Google account");
            return res.redirect(`${frontEndBaseUrl}/error?error=oauth`);
          }
          return res.redirect(`${frontEndBaseUrl}/`);
        });
      } else if (!user.isNewUser) {
        req.logIn(user, (err) => {
          if (err) {
            logger.error("Login error:", err);
            return res.redirect(`${frontEndBaseUrl}/error?error=oauth`);
          } else {
            logger.info("User logged in successfully:", user.email);
            //setCookie(req, res, next);
            return res.redirect(`${frontEndBaseUrl}/`);
          }
        });
      }
    },
  )(req, res, next);
});

export default router;
