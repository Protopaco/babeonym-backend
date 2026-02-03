import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';
import { logger } from '../../../utils/logger';

router.get('/me', ensureAuthenticated, async (req: Request, res: Response) => {
    if (!req.user) {
        logger.warn('User not found in request object');
        return res.status(404).json({ error: 'User not found' });

    }
    res.status(200).send({ user: req.user });
});

export default router;