import { Router } from "express";
const router = Router();

import getUserRouter from "./getUser.js";
import deleteUserRouter from "./deleteUser.js";
import getUserActionHistoryRouter from "./getUserActionHistory.js";

router.use(getUserRouter);
router.use(deleteUserRouter);
router.use(getUserActionHistoryRouter);

export default router;
