
import { Router } from 'express';
const router = Router();

import postCustomGivenNameRouter from './postCustomGivenName';

router.use(postCustomGivenNameRouter);

export default router;
