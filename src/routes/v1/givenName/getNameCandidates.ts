

import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';

import { logger } from '../../../utils/logger.js';
import getNameCandidates from '../../../db/getNameCandidates.js';
import Genders from '../../../models/Genders.js';


router.get('/candidates', ensureAuthenticated, async (req: Request, res: Response) => {
    logger.info(`GET /given-names/ by user ID: ${req.user!.id}`);
    const popularity = Number(req.query.popularity) || null;
    const genders = req.query.genders ? String(req.query.genders).split(',') : null;

    if (genders) {
        for (const gender of genders) {
            if (!Object.values(Genders).includes(gender)) {
                return res.status(400).json({ error: `Invalid gender: ${gender}` });
            }
        }
    }

    const decadeIds = req.query.decadeIds ? (req.query.decadeIds as string).split(',').map(Number) : null;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const include = String(req.query.include ?? '').split(',').filter(Boolean)
    const includeMeta = include.includes('meta');

    logger.debug({ genders, decadeIds, popularity, include, limit, includeMeta });
    const userId = req.user!.id;
    const givenNames = await getNameCandidates(userId, popularity, genders, decadeIds, limit, includeMeta);

    res.status(200).json(givenNames);
});

export default router;
