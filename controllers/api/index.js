const router = require('express').Router();
const userRoutes =  require('./userRoutes');
const postRoutes = require('./postRoutes');

const animationRoutes = require('./animationRoutes');
const commentRoutes = require('./commentRoutes');
const router = require('express').Router();

router.use('/animations', animationRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;