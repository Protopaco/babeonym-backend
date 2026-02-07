import express, { Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const frontEndBaseUrl =
  process.env.FRONTEND_BASE_URL || "http://localhost:4200";

router.get("/google/callback", (req, res, next) => {
  // Check if Google sent an error
  if (req.query.error) {
    console.error("Google returned error:", req.query.error);
    return res.redirect(
      `${frontEndBaseUrl}/login?error=oauth&details=${req.query.error}`,
    );
  }

  // Check if we have an authorization code
  if (!req.query.code) {
    console.error("No authorization code received from Google");
    return res.redirect(`${frontEndBaseUrl}/login?error=oauth&details=no_code`);
  }

  passport.authenticate("google", (err: any, user: any, info: any) => {
    if (err) {
      console.error("Google OAuth error:", err);
      return res.redirect(`${frontEndBaseUrl}/login?error=oauth`);
    }
    if (!user) {
      console.error("No user returned from OAuth strategy");
      return res.redirect(
        `${frontEndBaseUrl}/login?error=oauth&details=no_user`,
      );
    }

    // Extra safety check - make sure user is not false or other falsy values
    if (user === false || typeof user !== "object") {
      console.error("Invalid user object type:", typeof user, user);
      return res.redirect(
        `${frontEndBaseUrl}/login?error=oauth&details=invalid_user`,
      );
    }

    if (user.isNewUser) {
      console.log("New user detected:", user.email);
      return res.redirect(
        `${frontEndBaseUrl}/user/redirect?email=${encodeURIComponent(user.email)}&googleId=${encodeURIComponent(user.googleId)}`,
      );
    } else if (!user.isNewUser) {
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect(`${frontEndBaseUrl}/user/login?error=oauth`);
        } else {
          console.log("User logged in successfully:", user.email);
          //setCookie(req, res, next);
          return res.redirect(`${frontEndBaseUrl}/user/login/success`);
        }
      });
    }
  })(req, res, next);
});

export default router;
