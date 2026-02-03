import { Router } from "express";
const router = Router();

import getUserRouter from "./getUser.js";
import getUserActionHistoryRouter from "./getUserActionHistory.js";


router.use(getUserRouter);
router.use(getUserActionHistoryRouter);

export default router;