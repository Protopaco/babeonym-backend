import { Router } from 'express';
const router = Router();

import getDecadesRouter from './getDecades.js';
import getCulturesRouter from './getCultures.js';

router.use(getCulturesRouter);
router.use(getDecadesRouter);

export default router;
