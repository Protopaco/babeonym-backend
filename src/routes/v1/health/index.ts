import { Router } from "express";
const router = Router();

import getHealthRouter from "./getHealth.js";

router.use(getHealthRouter);

export default router;
