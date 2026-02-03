import { Router, Request, Response } from 'express';
const router = Router();
import ensureAuthenticated from '../../../middleware/ensureAuthenticated';
import addCustomGivenName from '../../../db/addCustomGivenName';
import { logger } from '../../../utils/logger.js';
import NameState from '../../../models/NameState.js';
import updateGivenNameAction from '../../../db/updateGivenNameAction.js';


router.post('/action', ensureAuthenticated, async (req: Request, res: Response) => {

    logger.debug(req.body);
    const { givenCustomNameBridgeId, newState } = req.body;
    if (typeof givenCustomNameBridgeId !== 'number' || !newState || (newState !== NameState.SELECTED && newState !== NameState.REJECTED && newState !== NameState.SNOOZED)) {
        return res.status(400).json({ error: 'Invalid request parameters' });
    }
    await updateGivenNameAction(req.user!.id, givenCustomNameBridgeId, newState);
    res.status(200).json({ message: 'Given name action updated successfully' });
}
)

export default router;