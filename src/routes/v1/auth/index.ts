import { Router } from "express";
const router = Router();

import getGoogleRouter from "./getGoogle.js";
import getGoogleCallbackRouter from "./getGoogleCallback.js";
import getAnonymousRouter from "./getAnonymous.js";
import getMicrosoftRouter from "./getMicrosoft.js";
import getMicrosoftCallbackRouter from "./getMicrosoftCallback.js";
import postLogoutRouter from "./postLogout.js";

router.use(getAnonymousRouter);
router.use(postLogoutRouter);
router.use(getGoogleRouter);
router.use(getGoogleCallbackRouter);
router.use(getMicrosoftRouter);
router.use(getMicrosoftCallbackRouter);

export default router;
