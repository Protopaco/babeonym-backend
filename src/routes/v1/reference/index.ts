import { Router } from 'express';
const router = Router();

import getNameFiltersRouter from './getNameFilters.js';

router.use(getNameFiltersRouter);

export default router;
