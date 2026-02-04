
import { Router } from 'express';
const router = Router();

import getGivenNamesByUserId from './getNameCandidates';
import postCustomGivenNameRouter from './postCustomGivenName';
import getApprovedGivenNamesRouter from './getApprovedGivenNames';
import postGivenNameActionRouter from './postGivenNameAction';


router.use(getGivenNamesByUserId);
router.use(getApprovedGivenNamesRouter);
router.use(postCustomGivenNameRouter);
router.use(postGivenNameActionRouter);

export default router;
