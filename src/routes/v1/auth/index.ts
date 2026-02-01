import { Router } from 'express';
const router = Router();

import getValidRouter from './getValid.js';
import getGoogleRouter from './getGoogle.js';
import getAnonymousRouter from './getAnonymous.js';
//import callbackRouter from './callback';
import postLogoutRouter from './postLogout.js';

router.use(getValidRouter);
router.use(getAnonymousRouter);
// router.use(`${basePath}/google`, getGoogleRouter);
// //router.use(`${basePath}/callback`, callbackRouter);
// router.use(`${basePath}/logout`, postLogoutRouter);
export default router;