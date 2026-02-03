import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';
import { logger } from '../../../utils/logger.js';
import getLanguages from '../../../db/getLanguages.js';


router.get('/languages', ensureAuthenticated, async (req: Request, res: Response) => {
    const languages = await getLanguages();
    logger.debug(languages);
    res.status(200).json({ languages });
});

export default router;
