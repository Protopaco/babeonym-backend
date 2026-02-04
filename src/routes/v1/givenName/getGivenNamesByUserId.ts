

import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated';

import { logger } from '../../../utils/logger.js';
import getGivenNamesByUserId from '../../../db/getGivenNamesByUserId.js';


router.get('/', ensureAuthenticated, async (req: Request, res: Response) => {
    logger.info(`GET /given-names/ by user ID: ${req.user!.id}`);
    const popularity = Number(req.query.popularity) || null;
    const genders = req.query.gender ? (req.query.gender as string).split(',') : null;
    const decades = req.query.decade ? (req.query.decade as string).split(',') : null;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    logger.debug({ genders, decades, popularity });

    const userId = req.user!.id;
    const givenNames = await getGivenNamesByUserId(userId, popularity, genders, decades, limit);

    res.status(200).json(givenNames);
});

export default router;
