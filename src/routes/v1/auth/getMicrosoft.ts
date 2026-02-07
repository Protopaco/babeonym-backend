import { Router } from "express";
const router = Router();
import passport from "passport";

router.get(
  "/microsoft",
  passport.authenticate("microsoft", { scope: ["openid", "email"] }),
);

export default router;
