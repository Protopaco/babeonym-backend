import { Router } from "express";
const router = Router();

import getGivenNamesByUserId from "./getNameCandidates";
import postCustomGivenNameRouter from "./postCustomGivenName";
import postCompareGivenNamesRouter from "./postCompareGivenNames";
import getApprovedGivenNamesRouter from "./getApprovedGivenNames";
import postGivenNameActionRouter from "./postGivenNameAction";
import getGivenNamesSearch from "./getGivenNamesSearch";
import getGivenNameEtymology from "./getGivenNameEtymology";

router.use(getGivenNamesByUserId);
router.use(getApprovedGivenNamesRouter);
router.use(postCustomGivenNameRouter);
router.use(postCompareGivenNamesRouter);
router.use(postGivenNameActionRouter);
router.use(getGivenNamesSearch);
router.use(getGivenNameEtymology);

export default router;
