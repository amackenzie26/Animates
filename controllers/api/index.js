const userRoutes =  require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const { Router } = require('express');

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

module.exports = router;