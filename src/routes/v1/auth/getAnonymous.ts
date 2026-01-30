import router from '../../../utils/router.js';

router.get('/anonymous', (req, res) => {
    // Create an anonymous user session
    req.login({ id: 'anonymous' }, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create anonymous session' });
        }
        return res.status(200).json({ message: 'Anonymous session created' });
    });
});

export default router;