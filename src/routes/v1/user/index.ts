import { Router } from "express";
const router = Router();

import getUserRouter from "./getUser.js";

router.use(getUserRouter);

export default router;