import express, { Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const frontEndBaseUrl =
  process.env.FRONTEND_BASE_URL || "http://localhost:4200";

// /api/v1/auth/microsoft/callback
router.get("/microsoft/callback", (req, res, next) => {
  if (req.query.error) {
    return res.redirect(
      `${frontEndBaseUrl}/login?error=oauth&details=${req.query.error}`,
    );
  }

  if (!req.query.code) {
    return res.redirect(`${frontEndBaseUrl}/login?error=oauth&details=no_code`);
  }

  passport.authenticate("microsoft", (err: any, user: any) => {
    if (err) {
      return res.redirect(`${frontEndBaseUrl}/login?error=oauth`);
    }

    if (!user || typeof user !== "object") {
      return res.redirect(
        `${frontEndBaseUrl}/login?error=oauth&details=no_user`,
      );
    }

    if (user.isNewUser) {
      return res.redirect(
        `${frontEndBaseUrl}/user/redirect?email=${encodeURIComponent(
          user.email ?? "",
        )}&microsoftId=${encodeURIComponent(user.microsoftId)}`,
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