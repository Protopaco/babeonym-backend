import { Router } from "express";
const router = Router();

import getGivenNamesByUserId from "./getNameCandidates";
import postCustomGivenNameRouter from "./postCustomGivenName";
import getApprovedGivenNamesRouter from "./getApprovedGivenNames";
import postGivenNameActionRouter from "./postGivenNameAction";
import getGivenNamesSearch from "./getGivenNamesSearch";

router.use(getGivenNamesByUserId);
router.use(getApprovedGivenNamesRouter);
router.use(postCustomGivenNameRouter);
router.use(postGivenNameActionRouter);
router.use(getGivenNamesSearch);

export default router;
