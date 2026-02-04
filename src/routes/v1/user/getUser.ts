import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated.js';
import { logger } from '../../../utils/logger';

router.get('/me', ensureAuthenticated, async (req: Request, res: Response) => {
    res.status(200).send({ user: req.user });
});

export default router;