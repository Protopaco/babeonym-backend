
import { Router } from 'express';
const router = Router();

import postCustomGivenNameRouter from './postCustomGivenName';
import getApprovedGivenNamesRouter from './getApprovedGivenNames';

router.use(getApprovedGivenNamesRouter);
router.use(postCustomGivenNameRouter);

export default router;
