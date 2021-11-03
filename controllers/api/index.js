const userRoutes =  require('./userRoutes');
const postRoutes = require('./postRoutes');
const animationRoutes = require('./animationRoutes');
const router = require('express').Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/animations', animationRoutes);

module.exports = router;