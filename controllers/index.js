const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');


router.use('/api', apiRoutes);
router.use('/', homeRoutes);

router.use('/create/animation', async (req, res) => {
    res.render('create-animation');
});

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;