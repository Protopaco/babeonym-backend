import { Router } from 'express';
const router = Router();

import getCulturesRouter from './getCultures.js';
import getDecadesRouter from './getDecades.js';
import getLanguagesRouter from './getLanguages.js';

router.use(getCulturesRouter);
router.use(getDecadesRouter);
router.use(getLanguagesRouter);

export default router;
