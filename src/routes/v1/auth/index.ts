import router from '../../../utils/router.js'

import getValidRouter from './getValid.js';
import getGoogleRouter from './getGoogle.js';
//import callbackRouter from './callback';
import postLogoutRouter from './postLogout.js';

router.use(getValidRouter);
// router.use(`${basePath}/google`, getGoogleRouter);
// //router.use(`${basePath}/callback`, callbackRouter);
// router.use(`${basePath}/logout`, postLogoutRouter);
export default router;