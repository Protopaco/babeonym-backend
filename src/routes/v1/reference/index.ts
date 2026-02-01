import { Router } from 'express';
const router = Router();

import getDecadesRouter from './getDecades.js';

router.use(getDecadesRouter);

export default router;
