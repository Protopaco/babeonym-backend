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

router.get("/google/callback", async (req, res, next) => {
  const cookieUser = req.user as User | undefined;
  // Check if Google sent an error
  if (req.query.error) {
    logger.error(req.query.error, "Error received from Google OAuth callback");
    return res.redirect(
      `${frontEndBaseUrl}/login?error=oauth&details=${req.query.error}`,
    );
  }

  // Check if we have an authorization code
  if (!req.query.code) {
    logger.error("No authorization code received from Google");
    return res.redirect(`${frontEndBaseUrl}/login?error=oauth&details=no_code`);
  }

  await passport.authenticate(
    "google",
    async (err: any, user: any, info: any) => {
      if (err) {
        logger.error("Google OAuth error:", err);
        return res.redirect(`${frontEndBaseUrl}/login?error=oauth`);
      }
      if (!user) {
        logger.error("No user returned from OAuth strategy");
        return res.redirect(
          `${frontEndBaseUrl}/login?error=oauth&details=no_user`,
        );
      }

      // Extra safety check - make sure user is not false or other falsy values
      if (user === false || typeof user !== "object") {
        logger.error(user, "Invalid user object type");
        return res.redirect(
          `${frontEndBaseUrl}/login?error=oauth&details=invalid_user`,
        );
      }

      if (user.isNewUser && !cookieUser) {
        logger.info("New user detected:", user.email);
        return res.redirect(
          `${frontEndBaseUrl}/user/redirect?email=${encodeURIComponent(user.email)}&googleId=${encodeURIComponent(user.googleId)}`,
        );
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
      } else if (!user.isNewUser) {
        req.logIn(user, (err) => {
          if (err) {
            logger.error("Login error:", err);
            return res.redirect(`${frontEndBaseUrl}/user/login?error=oauth`);
          } else {
            logger.info("User logged in successfully:", user.email);
            //setCookie(req, res, next);
            return res.redirect(`${frontEndBaseUrl}/user/login/success`);
          }
        });
      }
    },
  )(req, res, next);
});

export default router;
